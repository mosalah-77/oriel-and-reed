import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer as createHttpServer, request } from 'node:http';
import { randomUUID } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer, loadConfigFromFile } from 'vite';

const loader = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false } });
after(() => loader.close());
const { validateContact, contactLimits } = await loader.ssrLoadModule('/src/contact-validation.ts');
const { createContactMiddleware } = await loader.ssrLoadModule('/server/contact.ts');

const valid = () => ({
  id: randomUUID(),
  name: ' Alex Example ',
  email: ' alex@example.com ',
  message: ' We would like help planning a living room with space for reading. ',
});

async function fixture(t, options = {}, configuredMiddleware) {
  const root = await mkdtemp(join(tmpdir(), 'oriel-contact-test-'));
  const outbox = join(root, 'outbox');
  const middleware = configuredMiddleware ?? createContactMiddleware({ outbox, ...options });
  const server = createHttpServer((req, res) => middleware(req, res, () => { res.writeHead(404).end(); }));
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  });
  return {
    outbox, origin,
    post: (body, headers = {}) => fetch(`${origin}/api/consultations`, {
      method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  };
}

test('shared validation trims input, supports Unicode and enforces both length boundaries', () => {
  const input = { ...valid(), name: ' نور ', message: 'x'.repeat(contactLimits.messageMin) };
  assert.deepEqual(validateContact(input).errors, {});
  assert.equal(validateContact(input).data.name, 'نور');
  for (const message of ['x'.repeat(contactLimits.messageMin - 1), 'x'.repeat(contactLimits.messageMax + 1)]) {
    assert.ok(validateContact({ ...input, message }).errors.message);
  }
  assert.ok(validateContact({ ...input, email: 'alex@' }).errors.email);
  assert.ok(validateContact({ ...input, email: 'alex\u0000@example.com' }).errors.email);
  assert.ok(validateContact({ ...input, name: '\u0000Alex' }).errors.name);
  assert.ok(validateContact({ ...input, message: 123 }).errors.message);
  assert.equal(Object.keys(validateContact(null).errors).length, 3);
});

test('successful and concurrent retried requests persist one private receipt', async t => {
  const { post, outbox } = await fixture(t);
  const body = valid();
  const responses = await Promise.all([post(body), post(body)]);
  assert.deepEqual(responses.map(r => r.status).sort(), [200, 201]);
  for (const response of responses) assert.deepEqual(await response.json(), { status: 'stored', id: body.id });
  assert.equal(responses[0].headers.get('cache-control'), 'no-store');
  assert.equal(responses[0].headers.get('x-content-type-options'), 'nosniff');
  assert.deepEqual(await readdir(outbox), [`${body.id}.json`]);
  const receipt = JSON.parse(await readFile(join(outbox, `${body.id}.json`), 'utf8'));
  assert.equal(receipt.name, 'Alex Example');
  assert.equal(receipt.email, 'alex@example.com');
  assert.equal(receipt.message, body.message.trim());
  assert.ok(Number.isFinite(Date.parse(receipt.createdAt)));
  assert.equal((await stat(outbox)).mode & 0o777, 0o700);
  assert.equal((await stat(join(outbox, `${body.id}.json`))).mode & 0o777, 0o600);
  const changed = await post({ ...body, message: 'A changed brief must not overwrite the original request.' });
  assert.equal(changed.status, 409);
  assert.equal(JSON.parse(await readFile(join(outbox, `${body.id}.json`), 'utf8')).message, body.message.trim());
});

test('invalid bodies, unknown fields and unsafe request IDs never save a receipt', async t => {
  const { post, outbox } = await fixture(t);
  for (const body of [null, [], '{broken', { ...valid(), email: 'bad' }, { ...valid(), message: '' },
    { ...valid(), id: '../outside' }, { ...valid(), extra: 'unexpected' }, { ...valid(), name: 42 }]) {
    assert.equal((await post(body)).status, 400);
  }
  assert.equal((await post('x'.repeat(17 * 1024))).status, 413);
  await assert.rejects(readdir(outbox), { code: 'ENOENT' });
});

test('only same-origin loopback JSON POST requests are accepted', async t => {
  const { origin, post, outbox } = await fixture(t);
  const get = await fetch(`${origin}/api/consultations`);
  assert.equal(get.status, 405);
  assert.equal(get.headers.get('allow'), 'POST');
  assert.equal((await post(valid(), { Origin: 'https://unrelated.example' })).status, 403);
  assert.equal((await post(valid(), { Origin: 'null' })).status, 403);
  assert.equal((await post(valid(), { Host: 'unrelated.example', Origin: 'http://unrelated.example' })).status, 403);
  assert.equal((await post(valid(), { 'Content-Type': 'text/plain' })).status, 415);
  await assert.rejects(readdir(outbox), { code: 'ENOENT' });
});

test('chunked bodies are bounded without relying on Content-Length', async t => {
  const { origin, outbox } = await fixture(t);
  const status = await new Promise((resolve, reject) => {
    const req = request(`${origin}/api/consultations`, {
      method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'Transfer-Encoding': 'chunked' },
    }, res => { res.resume(); resolve(res.statusCode); });
    req.on('error', reject);
    req.end('x'.repeat(17 * 1024));
  });
  assert.equal(status, 413);
  await assert.rejects(readdir(outbox), { code: 'ENOENT' });
});

test('an unfinished body expires and never creates a receipt', { timeout: 8000 }, async t => {
  const { origin, outbox } = await fixture(t);
  const status = await new Promise((resolve, reject) => {
    const req = request(`${origin}/api/consultations`, {
      method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' },
    }, res => { res.resume(); res.on('end', () => { resolve(res.statusCode); req.destroy(); }); });
    req.on('error', reject);
    t.after(() => req.destroy());
    req.write('{');
  });
  assert.equal(status, 408);
  await assert.rejects(readdir(outbox), { code: 'ENOENT' });
});

test('an interrupted upload saves nothing and leaves the endpoint usable', async t => {
  const { origin, outbox, post } = await fixture(t);
  await new Promise(resolve => {
    const req = request(`${origin}/api/consultations`, {
      method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' },
    });
    req.on('error', () => {});
    req.on('close', resolve);
    req.write('{', () => setTimeout(() => req.destroy(), 50));
  });
  await assert.rejects(readdir(outbox), { code: 'ENOENT' });
  assert.equal((await post(valid())).status, 201);
});

test('private receipts cannot be read through Vite, encoded paths or raw queries', async t => {
  const vite = await createServer({ server: { host: '127.0.0.1', port: 0, strictPort: true, hmr: false } });
  await vite.listen();
  t.after(() => vite.close());
  const origin = `http://127.0.0.1:${vite.httpServer.address().port}`;
  const body = valid();
  const receipt = join(process.cwd(), '.local', 'consultations', `${body.id}.json`);
  t.after(() => rm(receipt, { force: true }));
  const saved = await fetch(`${origin}/api/consultations`, {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  assert.equal(saved.status, 201);
  for (const path of [
    `/.local/consultations/${body.id}.json`, `/.local/consultations/${body.id}.json?raw`,
    `/.local%2fconsultations%2f${body.id}.json`, `/@fs${receipt}`, `/@fs${receipt}?raw`,
  ]) {
    const response = await fetch(`${origin}${path}`);
    const content = await response.text();
    assert.ok(!content.includes(body.message.trim()), `Receipt leaked: ${path}`);
    if (path.includes('%2f')) {
      // Vite treats encoded separators as an unknown SPA route, not a file request.
      assert.equal(response.status, 200, path);
      assert.match(response.headers.get('content-type'), /^text\/html/);
      assert.ok(content.includes('<div id="root"></div>'));
    } else assert.equal(response.status, 403, path);
  }
});

test('storage failure and deliberate test rejection never acknowledge success', async t => {
  const blocked = await fixture(t);
  await writeFile(blocked.outbox, 'a file cannot be used as an outbox');
  const response = await blocked.post(valid());
  assert.equal(response.status, 500);
  assert.doesNotMatch(await response.text(), /stored|ENOENT|EEXIST|oriel-contact-test/);
  const rejecting = await fixture(t, { testMode: 'reject' });
  assert.equal((await rejecting.post(valid())).status, 503);
  await assert.rejects(readdir(rejecting.outbox), { code: 'ENOENT' });
});

test('the local endpoint limits repeated attempts', async t => {
  const { post } = await fixture(t);
  for (let i = 0; i < 20; i++) assert.equal((await post('{}')).status, 400);
  const response = await post(valid());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '60');
});

test('Vite keeps receipts in its protected folder even if an outbox override is supplied', async t => {
  const root = await mkdtemp(join(tmpdir(), 'oriel-contact-config-'));
  const unsafeOutbox = join(root, 'public', 'receipts');
  const previous = process.env.ORIEL_CONTACT_OUTBOX;
  let config;
  try {
    process.env.ORIEL_CONTACT_OUTBOX = unsafeOutbox;
    ({ config } = await loadConfigFromFile({ command: 'serve', mode: 'test' }));
  } finally {
    if (previous === undefined) delete process.env.ORIEL_CONTACT_OUTBOX;
    else process.env.ORIEL_CONTACT_OUTBOX = previous;
  }
  t.after(() => rm(root, { recursive: true, force: true }));
  let middleware;
  config.plugins.find(plugin => plugin.name === 'local-contact-demo').configureServer({
    middlewares: { use(handler) { middleware = handler; } },
  });
  const { post } = await fixture(t, {}, middleware);
  const body = valid();
  const receipt = join('.local', 'consultations', `${body.id}.json`);
  t.after(() => rm(receipt, { force: true }));
  assert.equal((await post(body)).status, 201);
  await assert.rejects(readdir(unsafeOutbox), { code: 'ENOENT' });
  assert.equal(JSON.parse(await readFile(receipt, 'utf8')).id, body.id);
});

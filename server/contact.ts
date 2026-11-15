import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { link, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { contactFields, validateContact, type ContactFields } from '../src/contact-validation.ts';

const maxBytes = 16 * 1024;
const requestId = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;

class RequestError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let bytes = 0;
    let settled = false;
    const finish = (error?: RequestError) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      req.off('data', onData);
      req.off('end', onEnd);
      req.off('aborted', onAbort);
      if (error) { req.resume(); reject(error); }
      else resolve(Buffer.concat(chunks).toString('utf8'));
    };
    const onData = (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > maxBytes) finish(new RequestError(413, 'Request is too large.'));
      else chunks.push(chunk);
    };
    const onEnd = () => finish();
    const onAbort = () => finish(new RequestError(400, 'Request was interrupted.'));
    const timer = setTimeout(() => finish(new RequestError(408, 'Request took too long.')), 5000);
    req.on('data', onData);
    req.once('end', onEnd);
    req.once('aborted', onAbort);
    req.once('error', onAbort);
  });
}

async function storeReceipt(outbox: string, id: string, data: ContactFields): Promise<number> {
  await mkdir(outbox, { recursive: true, mode: 0o700 });
  const target = join(outbox, `${id}.json`);
  const temporary = join(outbox, `${id}.${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, JSON.stringify({ id, createdAt: new Date().toISOString(), ...data }), { flag: 'wx', mode: 0o600 });
    try {
      // Publish a complete receipt atomically, without replacing an existing request.
      await link(temporary, target);
      return 201;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      const previous = JSON.parse(await readFile(target, 'utf8'));
      if (!contactFields.every(field => previous[field] === data[field])) {
        throw new RequestError(409, 'This request ID already belongs to different details.');
      }
      return 200;
    }
  } finally {
    await rm(temporary, { force: true });
  }
}

export function createContactMiddleware({ outbox, testMode }: { outbox: string; testMode?: string }) {
  const attempts: number[] = [];
  // shortcut: loopback demo only; replace this adapter with a deployed service before public delivery.
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.url?.split('?')[0] !== '/api/consultations') return next();
    const send = (status: number, body: object) => {
      if (res.destroyed || res.writableEnded) return;
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff', Connection: 'close' });
      res.end(JSON.stringify(body));
    };
    const handle = async () => {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        throw new RequestError(405, 'Use POST for this endpoint.');
      }
      const host = req.headers.host ?? '';
      if (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d{1,5})?$/.test(host)
        || !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress ?? '')
        || req.headers.origin !== `http://${host}`) {
        throw new RequestError(403, 'Use the form in the local preview.');
      }
      if (req.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') {
        throw new RequestError(415, 'Use JSON for this endpoint.');
      }
      const now = Date.now();
      while (attempts.length && attempts[0] <= now - 60_000) attempts.shift();
      if (attempts.length >= 20) {
        res.setHeader('Retry-After', '60');
        throw new RequestError(429, 'Wait a minute before trying again.');
      }
      attempts.push(now);
      if (Number(req.headers['content-length']) > maxBytes) throw new RequestError(413, 'Request is too large.');
      const raw = await readBody(req);
      let body: unknown;
      try { body = JSON.parse(raw); }
      catch { throw new RequestError(400, 'Request must contain valid JSON.'); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new RequestError(400, 'Check the request details.');
      const record = body as Record<string, unknown>;
      if (Object.keys(record).some(key => !['id', ...contactFields].includes(key))
        || typeof record.id !== 'string' || !requestId.test(record.id)) throw new RequestError(400, 'Check the request details.');
      const { data, errors } = validateContact(record);
      if (Object.keys(errors).length) { send(400, { errors }); return; }
      if (testMode === 'reject') throw new RequestError(503, 'The test endpoint is unavailable.');
      if (testMode === 'slow') await delay(2000);
      const status = await storeReceipt(outbox, record.id, data);
      send(status, { status: 'stored', id: record.id });
    };
    void handle().catch(error => {
      if (error instanceof RequestError) send(error.status, { error: error.message });
      else send(500, { error: 'The test server could not confirm the save.' });
    });
  };
}

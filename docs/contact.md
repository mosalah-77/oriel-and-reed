# Closing invitation and contact

The homepage and Services/About page now end with “Have a room in mind?” and a link to `/contact`. The contact page pairs a short introduction with three fields: name, email and a brief description of the space. It uses the existing type, colors and spacing, with one column on phones.

## How the form works

The browser checks the fields before submitting. The server checks them again because browser checks can be bypassed. While the request is pending, the form is disabled. A confirmed save replaces it with a focused success heading. A failed request leaves the details in place and announces an error. The same unchanged retry reuses its request ID, so a lost response does not create another receipt.

Success means a real local save. It does not mean an email was delivered or an appointment was booked. Use fictional details only.

## Completed exercise

The user changed `src/contact-validation.ts` from:

```ts
messageMin: 20,
```

to:

```ts
messageMin: 30,
```

The user confirmed the 30-character validation works. The helper text and browser/server checks now use that minimum, and the edit has been preserved. The next exercise is in [the gallery walkthrough](project-gallery.md).

## Local storage and limits

Run the site with `npm run dev`, or build it and use `npm run preview`. Both commands bind to `127.0.0.1` and register `POST /api/consultations`. The endpoint accepts only same-origin, loopback JSON requests.

Receipts are written to the fixed `.local/consultations/` directory. A receipt contains the request ID, creation time and three submitted fields. This directory is ignored by Git, blocked by Vite's dev file server, excluded from the build and ignored by the file watcher. New directories use mode `0700` and receipts use `0600`. Receipts persist across restarts. There is no public read endpoint, analytics or logging of form contents.

The server accepts at most 16 KiB per request, waits up to five seconds for its body and limits attempts to 20 per minute. Field limits are 80 characters for the name, 254 for the email and 30–2000 for the brief. It rejects extra fields and invalid IDs. A complete temporary file is linked into place atomically; unchanged retries return the existing receipt without overwriting it. The browser stops waiting after ten seconds and keeps the fields available for retry.

The endpoint is a controlled local adapter, not a public submission service. A static upload of `dist` contains the page but no server. Public delivery needs a hosted endpoint and an explicitly chosen delivery destination before the demo language can change.

## Repeatable state checks

For a slow local save, build first and run this in a separate terminal:

```sh
ORIEL_CONTACT_TEST_MODE=slow npm run preview -- --port 5174 --strictPort
```

Open `http://127.0.0.1:5174/contact`. A valid fictional request pauses for two seconds, showing the disabled form and “Saving…” message before saving to the protected folder.

For an intentional failure:

```sh
ORIEL_CONTACT_TEST_MODE=reject npm run preview -- --port 5175 --strictPort
```

Open `http://127.0.0.1:5175/contact`. A valid request returns a failure, saves nothing and keeps the form values. Stop these test servers when finished. The mode is selected on the server; form input cannot enable it.

## Verification and references

The full suite now has 24 tests. Contact coverage includes shared validation, successful and concurrent duplicate saves, invalid requests, origin and method restrictions, request size and deadline, interrupted uploads, rate limits, storage failure and private storage access. The [verification loop](verification-loop.md) also checks the browser’s ten-second timeout recovery. TypeScript and the production build pass. Desktop, phone and keyboard checks cover the form states. Screenshots and measurements are in `docs/previews/`; the [learning log](learning-log.md) records the checks and remaining limits.

The implementation follows Vite's [development middleware hook](https://vite.dev/guide/api-plugin#configureserver) and [preview middleware hook](https://vite.dev/guide/api-plugin#configurepreviewserver). MDN documents when browsers include the [Origin header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Origin), including same-origin POST requests.

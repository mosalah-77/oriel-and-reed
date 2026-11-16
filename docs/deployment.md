# Hosted portfolio

Public address: [Oriel & Reed](https://oriel-and-reed.m-elmorshedy635.chatgpt.site).

The site uses Sites static hosting. `.openai/hosting.json` stores its existing project ID and points to `dist/`. Reuse that ID for updates. The GitHub repository remains the portfolio source and runs tests/builds through GitHub Actions; a GitHub push does not deploy the website automatically.

## What is published

`npm run build` produces the homepage, six page entrypoints, a 404 entrypoint and the local image/font assets. Each page entrypoint loads the same small application; normal links and trailing-slash URLs work without a custom rewrite rule. Only generated static output is packaged for hosting. Source files, test fixtures, private receipts and the local Node endpoint are excluded.

The public contact form validates fictional details in the browser. It makes no submission request and stores no form data. The local form still exercises real private storage on loopback addresses. Its server-side restrictions are unchanged.

## Updating the site

1. Make and verify the source changes. Run `npm test` and `npm run build`.
2. Reuse the Sites source checkout, or open the same project with the Sites source helper. The initial deployment checkout is in the ignored `.release/hosted-site/` directory; keep its hosting identity and source history when updating it.
3. Use the Sites source helper to run the build, push that exact source and package the generated output. Credentials belong only in the helper's hidden stdin, never in source or the hosting manifest.
4. Save and deploy the matching version, preserving public access. Check direct page links and the demo form after a code change. Push the corresponding source changes to GitHub too.

## Hosting checks

The hosting changes add tests for the public demo notice, retained local storage notice and trailing-slash routes. The suite contains 26 tests. The browser demo fixture checks error focus and completion focus and confirms zero submission attempts. The build output is checked for every known page entrypoint.

The test Vite servers use separate cache directories so they do not invalidate the running editor preview. The preview also ignores and blocks `.release/`, which holds deployment scratch files.

The earlier [verification record](verification-loop.md) documents the wider accessibility, responsive, performance and security work. Physical-device, screen-reader speech, Safari and Firefox checks remain outstanding.

# CLAUDE.md — Robhutt-Site

This repo hosts **robhutt.com**, which is now a **single static HTML page**.

> History: this repo previously contained a full-stack CharacterX site
> (Express 5 + Postgres/Drizzle, the public Scorecard, the Strategy Builder,
> and an HMAC-signed scorecard webhook from icemaker). That app was
> deliberately torn down and replaced by the static page. The icemaker
> webhook (`POST /api/scorecard-webhook`) no longer exists here — if icemaker
> is still sending scorecard payloads, that integration must be retired on the
> platform side.

## What this repo is

A finished, hand-tuned static marketing page for Rob Hutt. The design, copy,
fonts, colours, and animations are deliberate. Port and host it faithfully;
do not redesign, rephrase copy, or "modernise" it.

- The page lives at `robhutt-com/index.html` (inline CSS/JS, Google Fonts:
  Fraunces + Spline Sans Mono). See `robhutt-com/README.md`.
- There are **zero em dashes (—) and zero en dashes (–)** in the page, on
  purpose. Do not introduce any.

## Stack

- Plain HTML/CSS/JS page. No client framework, no client bundler.
- `server/index.ts` — a tiny Express static-file server. Its only job is to
  satisfy Render's Web Service contract (bind `$PORT`, serve `dist/public`).
- `script/build.ts` — copies `robhutt-com/` into `dist/public` and bundles
  the server to `dist/index.cjs` with esbuild.

## Run commands

```bash
npm install
npm run build     # copy page to dist/public, bundle server
npm start         # serve dist/ on $PORT (default 5000)
# or, just the page:
npx serve robhutt-com
```

## Deployment

Render Web Service, auto-deploys from `main` (build: `npm install && npm run
build`; start: `npm start`). Merging to `main` is the production cutover.
robhutt.com DNS points at this Render service, so a page change needs no DNS
change.

## Editing the page

Only these edits are expected (all marked `TODO` in `index.html`): the
booking-link placeholder, the email placeholder, the four commented `<source>`
lines for the video reels, and the optional favicon/OG image. The
`[bracketed]` editorial notes in the copy are intentional reminders for Rob.

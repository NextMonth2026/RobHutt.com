# robhutt.com

The robhutt.com marketing site: a single static HTML page with inline CSS/JS
and Google Fonts (Fraunces + Spline Sans Mono). No framework, no client
bundler.

This page is the **whole site**. The previous full-stack CharacterX app
(Scorecard, Strategy Builder, icemaker webhook) was removed; robhutt.com now
serves only this page.

## Source layout

```
robhutt-com/
  index.html          the page (edit this)
  assets/
    video/            drop reel-01.mp4 ... reel-04.mp4 here
    img/              favicon.png and og.png go here
  README.md
```

At the repo root, `server/index.ts` is a ~20-line static-file server and
`script/build.ts` copies this folder into `dist/public` and bundles the
server to `dist/index.cjs`. That exists only because the host (Render) runs
this as a Web Service that must bind a port; the page itself stays pure
static.

## Run locally

Either serve the source folder directly:

```bash
npx serve robhutt-com
```

…or run exactly what production runs:

```bash
npm install
npm run build      # copies the page to dist/public, bundles the server
npm start          # serves dist/ on $PORT (default 5000)
```

## Things Rob needs to fill in

Search `index.html` for `TODO`:

1. **Booking link** — replace `REPLACE_WITH_YOUR_CALENDAR_LINK` in the
   `Book a conversation` button.
2. **Email** — contact actions route to `hello@nextmonth.io` and CC `rob@flashbuzz.co.uk`.
3. **Videos** — drop `reel-01.mp4` … `reel-04.mp4` into `assets/video/`,
   then uncomment the matching `<source>` line inside each `<video>`. Slots
   stay in placeholder state until a `<source>` is present.
4. **Editorial notes** — the `[bracketed]` reminders in the copy are
   intentional; edit them when the real details are ready.
5. **Favicon / social image** (optional) — add `assets/img/favicon.png` and
   `assets/img/og.png`, then uncomment the favicon `<link>` in `<head>`.

## Deploy

Hosted on **Render** as a Web Service, auto-deploying from the `main` branch
(build: `npm install && npm run build`; start: `npm start`). Merging to
`main` is the production cutover — Render rebuilds and robhutt.com serves the
new page.

robhutt.com's DNS already points at this Render service, so **no DNS change
is needed** for the page swap. (If the Render service is ever switched to a
Render "Static Site" or another host, point its publish directory at the
built `dist/public` and update DNS accordingly.)

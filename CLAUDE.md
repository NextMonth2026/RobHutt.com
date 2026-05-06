# CLAUDE.md — Robhutt-Site

You are working on the **public CharacterX/Method site** — Rob Hutt's customer-facing methodology site that hosts the Method explainer, the Planner, the Public Scorecard, and the Strategy Builder. The site embeds Norman strategy chat and receives HMAC-signed scorecard payloads from icemaker/NextMonth.

This is a **full-stack site** with Postgres, Express, and signed-webhook integration with the platform. It is operationally adjacent to icemaker — many of the same architectural rules apply, and CharacterX is the central methodology this site exists to communicate.

---

## What this repo is

The public face of Rob's methodology and the entry point into the NextMonth funnel. This site demonstrates CharacterX, captures intent via the Scorecard, and hands warm leads to the platform via the Strategy Builder.

Sister repos in NextMonth2026:

- `icemaker` — the NextMonth platform. **This site receives HMAC-signed scorecard webhooks from there.** Schema and HMAC contract are coupled — changes here may require platform-side changes.
- `Flashbuzz_New` — Flashbuzz video production portfolio
- `Hutt-Studio` — Hutt Studio creative practice
- `RobHuttFilms` — Rob Hutt Films portfolio

Do not import code between repos. Do treat the icemaker integration contract (HMAC payload shape) as a versioned interface — read `server/routes.ts` for the canonical schema before changing anything that crosses the boundary.

## Stack

- **Framework**: React 18 + TypeScript, Vite 7, Tailwind, shadcn/ui (New York style)
- **Routing**: Wouter
- **Backend**: Express 5 (note: 5.x, not 4.x — different from RobHuttFilms and Hutt-Studio), TypeScript
- **Database**: PostgreSQL via Drizzle ORM (`pg` driver, not Neon serverless)
- **Auth**: Passport local + bcrypt + express-session with memorystore
- **Strategy chat**: Norman strategy chat embedded via `client/src/components/strategy/NormanStrategyChat.tsx`
- **Build**: `tsx script/build.ts`
- **Start**: `node dist/index.cjs` (CommonJS output, not ESM)
- **Deployment**: Render Web Service (no `render.yaml` checked in — config is in the Render dashboard)

## Pages and routes

```
/                       Home — CharacterX intro, hero, methodology
/method, /characterx    Method explainer (same component, two URLs)
/planner/:plannerId     Personal planner instance
/scorecards/:slug       Public scorecard (the entry-point lead capture)
/scorecard/complete     Post-scorecard completion page
/strategy-builder       Strategy Builder — Norman chat experience
```

## External link constants

Centralised in `client/src/lib/constants.ts`:

```ts
MEETNORMAN_URL    = "https://meetnorman.io"
ICEMAKER_URL      = "https://icemaker.app"
CHARACTERX_URL    = "https://character-x.com"
NEXTMONTH_URL     = "https://nextmonth.io"
SCORECARD_URL     = "https://nextmonth.io/scorecards/characterx"
STRATEGY_URL      = "https://meetnorman.io"
CONTACT_EMAIL     = "hello@robhutt.com"
```

**Always update the constants file rather than hard-coding URLs.** That file is the single source of truth for cross-property links.

## API surface

The Express server exposes these routes (canonical signatures in `server/routes.ts` and `server/strategyBuilderRoutes.ts`):

```
POST  /api/scorecard-webhook         HMAC-signed payload from icemaker
GET   /api/strategy                  Current user's strategy (creates blank if none)
GET   /api/strategy/visitor/:token   Public read-only access
GET   /api/strategy/notes            Conversation notes for current strategy
POST  /api/strategy/claim-guest      Claim guest data after signup
POST  /api/strategy/chat             Send message in strategy chat
POST  /api/strategy/update-plan      Direct plan data update from PlanCanvas
```

The HMAC contract for the scorecard webhook:

- Header: `x-signature` with hex-encoded HMAC-SHA256 of the raw request body
- Secret: `SCORECARD_WEBHOOK_SECRET` env var (must match icemaker's sender-side secret)
- Payload schema (Zod-validated):
  ```ts
  {
    source: "robhutt-scorecard",
    scorecardId: uuid,
    completedAt: ISO datetime,
    insights: {
      primaryGoal: string,
      topPriorities: string[],
      keyBlockers: string[],
      strengths: string[],
      gaps: string[],
      recommendedFocus: string,
      confidenceScore: 0-100,
    }
  }
  ```
- Rate limit: 60 requests per IP per 15 minutes

**Do not change the HMAC contract or payload schema without coordinating with icemaker.** The platform sends to this endpoint — both sides must agree.

## CharacterX is the point

This site exists to communicate CharacterX. Customer = protagonist. Brand = guide. Ten components. Four-State Identity Model. Missing Scene as bridge. The same operational methodology that's wired into icemaker is communicated, demonstrated, and entered through here.

When making changes:

- The `/method` page is the core explainer. Treat its copy as contract — changes need Rob's review.
- The Scorecard is the lead-capture bridge. It must stay credible — no dark patterns, no growth-hack tricks, no fake urgency.
- The Strategy Builder is where Norman appears. **System acts, Norman narrates.** The strategy chat must stay aligned with the icemaker behaviour: Norman owns narrative, the system owns transitions and data mutations.

## Architectural rules

1. **No file over 1,000 lines. Warn at 800.** Current files near the threshold:
   - `client/src/pages/PublicScorecardPage.tsx` — 776 lines. Over warning, under cap. Refactor target for the next significant scorecard change.
   - `client/src/pages/Method.tsx` — 713 lines. Approaching warning. Treat with care.
   - `client/src/components/ui/sidebar.tsx` — 727 lines, shadcn vendor file, exempt.
2. **All routes lazy-loaded.**
3. **No directory matching a sibling `.tsx`/`.ts` filename.** Universal rule.
4. **HMAC contract is versioned.** Any change to the scorecard webhook payload, signature mechanism, or rate limit must be coordinated with icemaker.
5. **One source of truth.** External URLs in `constants.ts`. Strategy data in the Drizzle schema. Don't duplicate.
6. **System acts, Norman narrates** — same rule as icemaker. Strategy chat owns narrative; system owns mutations.

## Diagnosis discipline

Same as icemaker:

- Root cause before fix.
- Flag plasters explicitly.
- One source of truth — if two systems control the same data, that's the bug.
- If the third fix is another guard, stop and surface.
- Auth, HMAC, and rate-limiting bugs need structural fixes, not guards.

## Communication style for Rob

Direct, concise, no preamble. Honest pushback. Match iteration pace.

## Run commands

```bash
npm run dev               # Express dev server with Vite middleware
npm run build             # tsx script/build.ts
npm run start             # NODE_ENV=production node dist/index.cjs
npm run check             # tsc typecheck
npm run db:push           # drizzle-kit push (confirm DATABASE_URL is dev first)
```

## Environment variables

Required at runtime:

- `DATABASE_URL` — Postgres connection
- `SESSION_SECRET` — express-session secret
- `SCORECARD_WEBHOOK_SECRET` — HMAC shared secret with icemaker
- Auth admin credentials if applicable (mirror RobHuttFilms pattern with `ADMIN_EMAIL`/`ADMIN_PASSWORD` if used)

## Deployment

Render Web Service. No `render.yaml` checked in — deployment config is in the Render dashboard. Auto-deploys from `main`. Build runs `npm install && npm run build`. Start runs `npm start`.

When promoting changes to production:

1. Confirm `npm run check` passes locally.
2. Confirm any HMAC contract changes have been coordinated with icemaker and the platform secret matches.
3. Confirm constants.ts URLs still resolve.
4. Watch the Render deploy log for build errors that don't surface locally.

## Things this file does not cover

For the canonical CharacterX methodology — the ten components, the Four-State Identity Model, the Missing Scene framework — read the `/method` page source and the `replit.md` history. Rob's book on CharacterX is the deeper source, and is being written in parallel with the platform build.

# CODEX.md — Robhutt-Site

OpenAI Codex CLI configuration for the public CharacterX/Method site. Read `CLAUDE.md` first for the architectural contract.

This site is operationally adjacent to icemaker — it receives HMAC-signed webhooks from the platform, embeds Norman strategy chat, and is the public face of CharacterX. Treat it with the same architectural discipline as icemaker.

---

## Operating mode

- **Default**: `auto-edit`. Modify files freely, ask before shell commands.
- **`full-auto`**: feature branch only, never on `main`.
- **`suggest` mode for**:
  - Anything touching `server/routes.ts` HMAC verification or rate limiting
  - Anything touching `server/strategyBuilderRoutes.ts` (the Norman chat surface)
  - Schema changes in `shared/schema.ts`
  - `client/src/lib/constants.ts` (cross-property URLs)
  - The `/method` page copy — that's contract
  - Any change to the Scorecard payload schema (coupled with icemaker)
  - `package.json`, build scripts

The HMAC contract is the most sensitive surface in the repo. Both sides (this repo and icemaker) must agree, and a change here without a corresponding change there breaks production lead capture silently.

## Sandbox awareness

- **Network egress** needed for `npm install`, `vite build`, `drizzle-kit push`, runtime DB and session storage.
- **`DATABASE_URL`**: confirm it points at dev before any destructive operation. Production has real CharacterX scorecard insights from real users.
- **`SCORECARD_WEBHOOK_SECRET`**: never echo to logs, never commit. Production secret must match icemaker's sender-side secret.
- **`SESSION_SECRET`**: same — never log, never commit.

## What Codex sees that Claude Code doesn't

No MCP server attached. Use:

- `rg` for code search
- `psql $DATABASE_URL` for DB queries (read-only by default)
- `npm run check` for typecheck

## Architectural rules (Codex-relevant)

1. **No file over 1,000 lines.** Warning-level files: `PublicScorecardPage.tsx` (776), `Method.tsx` (713). Codex must not append to these without considering refactor.
2. **No directory matching a sibling `.tsx`/`.ts` filename.** Universal rule.
3. **HMAC contract is versioned.** Any change to scorecard webhook signature mechanism, payload schema, or rate limit needs coordination with icemaker. Codex should not autonomously change this surface.
4. **System acts, Norman narrates.** Strategy chat code respects the same three step types as icemaker. Norman never executes mutations directly.
5. **One source of truth.** External URLs in `constants.ts`. Strategy data in Drizzle schema. No duplication.

## HMAC contract checks (Codex must run)

Before opening any PR that touches `server/routes.ts`, Codex should verify:

```bash
# Confirm HMAC verification is intact
rg "createHmac|timingSafeEqual" server/

# Confirm rate limit is intact
rg "rateLimit|rateLimitMax" server/

# Confirm Zod schema for scorecard payload is intact
rg "scorecardPayloadSchema" server/
```

If any of these searches return empty after a change to the relevant code, that's a regression. Surface it before declaring the task done.

## Diagnosis discipline

- Trace to root cause before editing.
- Flag plasters with `PLASTER:` prefix.
- Stop at the third guard.
- HMAC, auth, and rate-limit bugs are never appropriate plaster targets — they need structural fixes.
- No `as` casts or `@ts-ignore` without a justifying comment.

## Brand and methodology enforcement

CharacterX language must stay accurate:

- "Customer = protagonist", "Brand = guide" — these mappings are contract.
- "Four-State Identity Model" — Present, Desired, Shadow, Admired Self.
- "Missing Scene" — the bridge experience.
- Ten CharacterX components.

If a PR introduces drift in this language, Codex should flag it. Rob's methodology is precise, and the site is the public articulation of it.

## Run commands

```bash
npm run dev
npm run build
npm run start
npm run check
npm run db:push    # confirm DATABASE_URL is dev first
```

Run `npm run check` after non-trivial edits.

## What Codex must not do

- **No autonomous merges to `main`.** Open a PR.
- **No `db:push` against production.** Dev only.
- **No autonomous changes to HMAC verification, payload schema, or rate limit** — these are coupled to icemaker.
- **No edits to `client/src/lib/constants.ts`** without explicit instruction (cross-property links).
- **No copy changes to `/method`** without explicit instruction (contract).
- **No edits to `package.json` dependencies** without explicit instruction.
- **No edits to GitHub Actions workflows** without explicit instruction.
- **No commits that include real user scorecard data, session secrets, or webhook secrets.**

## Communication style for Rob

Direct, concise, no preamble. Honest pushback. Match iteration pace. No emoji unless Rob uses them first.

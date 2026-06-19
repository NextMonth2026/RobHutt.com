import express from "express";
import path from "path";

// robhutt.com is now a single static page. This is a tiny static-file server
// whose only job is to satisfy the Render Web Service contract (bind a port
// and serve files). No API, no database, no sessions.
const app = express();
app.use(express.urlencoded({ extended: false }));

// dist/public is produced by script/build.ts. __dirname resolves to dist/ in
// the bundled CommonJS output, so this is correct regardless of cwd.
const publicDir = path.join(__dirname, "public");


const adminCookieName = "rob_pitch_admin";
// TODO: Set ADMIN_PITCH_PASSWORD in production. The fallback is only for local development.
const adminPitchPassword = process.env.ADMIN_PITCH_PASSWORD || (process.env.NODE_ENV !== "production" ? "rob-local-pitches" : "");
function hasAdminAccess(req: express.Request) {
  return req.headers.cookie?.split(";").some((part) => part.trim() === `${adminCookieName}=1`);
}
function renderAdminGate(res: express.Response, failed = false) {
  res.status(failed ? 401 : 200).send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pitch Admin Login</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#15110b;color:#f4efe6;font-family:Georgia,serif}.card{width:min(680px,90vw);border:1px solid rgba(244,239,230,.22);padding:44px;background:rgba(244,239,230,.06)}h1{font-weight:300;font-size:clamp(2.4rem,6vw,4.8rem);line-height:.95}p{color:rgba(244,239,230,.72)}input,button{padding:16px;border:0}input{min-width:240px}button{background:#e8b13d;color:#0d0b08;font-weight:700}.error{color:#ffb4a0}</style></head><body><main class="card"><p>Private admin</p><h1>Pitch dashboard.</h1><p>Enter the admin password to continue.</p>${failed ? '<p class="error">Password did not match.</p>' : ''}<form method="post" action="/admin/pitches/login"><input name="password" type="password" autocomplete="current-password" autofocus><button type="submit">Enter</button></form></main></body></html>`);
}
function requirePitchAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (hasAdminAccess(req)) return next();
  return renderAdminGate(res);
}

app.post("/admin/pitches/login", (req, res) => {
  if (adminPitchPassword && req.body.password === adminPitchPassword) {
    res.setHeader("Set-Cookie", `${adminCookieName}=1; HttpOnly; SameSite=Lax; Path=/admin/pitches; Max-Age=86400`);
    res.redirect("/admin/pitches");
    return;
  }
  renderAdminGate(res, true);
});

app.get("/admin/pitches", requirePitchAdmin, (_req, res) => {
  res.sendFile(path.join(publicDir, "admin-pitches.html"));
});

app.get("/admin/pitches/:slug", requirePitchAdmin, (_req, res) => {
  res.sendFile(path.join(publicDir, "admin-pitch-detail.html"));
});

app.use(express.static(publicDir, { extensions: ["html"], maxAge: "1h" }));

app.get("/opportunities/:slug", (_req, res) => {
  res.sendFile(path.join(publicDir, "opportunity.html"));
});

// Single-page site: anything not matched as a static asset returns the page.
app.use((_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const port = Number(process.env.PORT) || 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`robhutt.com static site listening on :${port}`);
});

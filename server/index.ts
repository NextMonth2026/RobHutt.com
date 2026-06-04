import express from "express";
import path from "path";

// robhutt.com is now a single static page. This is a tiny static-file server
// whose only job is to satisfy the Render Web Service contract (bind a port
// and serve files). No API, no database, no sessions.
const app = express();

// dist/public is produced by script/build.ts. __dirname resolves to dist/ in
// the bundled CommonJS output, so this is correct regardless of cwd.
const publicDir = path.join(__dirname, "public");

app.use(express.static(publicDir, { extensions: ["html"], maxAge: "1h" }));

// Single-page site: anything not matched as a static asset returns the page.
app.use((_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const port = Number(process.env.PORT) || 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`robhutt.com static site listening on :${port}`);
});

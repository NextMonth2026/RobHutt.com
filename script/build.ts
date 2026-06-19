import { build as esbuild } from "esbuild";
import { rm, mkdir, cp } from "fs/promises";

// Build the static site for Render. Two steps:
//   1. copy the finished static page + assets into dist/public
//   2. bundle the tiny static-file server to dist/index.cjs (npm start runs it)
async function buildAll() {
  await rm("dist", { recursive: true, force: true });
  await mkdir("dist/public", { recursive: true });

  console.log("copying static site...");
  await cp("robhutt-com/index.html", "dist/public/index.html");
  await cp("robhutt-com/opportunity.html", "dist/public/opportunity.html");
  await cp("robhutt-com/assets", "dist/public/assets", { recursive: true });

  console.log("bundling server...");
  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    external: ["express"],
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

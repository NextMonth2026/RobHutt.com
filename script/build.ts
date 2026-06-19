import { build as esbuild } from "esbuild";
import { rm, mkdir, cp, readFile } from "fs/promises";

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

  const opportunityData = await readFile("robhutt-com/assets/js/opportunities.js", "utf8");
  const opportunitySlugs = [...opportunityData.matchAll(/^  "([^"]+)": \{/gm)].map((match) => match[1]);

  await Promise.all(
    opportunitySlugs.map(async (slug) => {
      await mkdir(`dist/public/opportunities/${slug}`, { recursive: true });
      await cp("robhutt-com/opportunity.html", `dist/public/opportunities/${slug}/index.html`);
    }),
  );

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

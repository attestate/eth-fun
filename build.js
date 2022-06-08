import { build } from "esbuild";
import { readFile } from "fs/promises";
const json = JSON.parse(
  await readFile(new URL("./package.json", import.meta.url))
);

build({
  entryPoints: ["./src/index.js"],
  outfile: "./cjs/index.js",
  external: [
    ...Object.keys(json.dependencies),
    ...Object.keys(json.devDependencies),
  ],
  platform: "node",
  target: "node14.16.1",
  format: "cjs",
  bundle: true,
})
  .catch((err) => {
    console.error("Process exited with error", err.toString());
    process.exit(1);
  })
  .then(() => console.info("Built successfully"));

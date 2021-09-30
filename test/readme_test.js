// @format
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { matchBlocks, exec } from "test-readme-md";
import test from "ava";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let content = readFileSync("./readme.md").toString();
content = content.replace(
  new RegExp("eth-fun", "g"),
  `file://${path.resolve(__dirname, "../src/index.js")}`
);
const blocks = matchBlocks("js", content);

for (let block of blocks) {
  test(`run ${block.split("\n")[0]}`, async (t) => {
    try {
      await exec(block);
    } catch (err) {
      t.log(err); // prints log alongside the test instead of immediately printing them to stdout
      t.fail();
    }

    t.pass();
  });
}

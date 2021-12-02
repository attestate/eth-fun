// @format
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { matchBlocks, exec } from "test-readme-md";
import test from "ava";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const testAllCodeSnippets = (content, filename) => {
  const modifiedContent = content.replace(
    new RegExp("eth-fun", "g"),
    `file://${path.resolve(__dirname, "../src/index.js")}`
  );
  const blocks = matchBlocks("js", modifiedContent);

  for (let block of blocks) {
    // name of test should be unique
    test(`run ${block.split("\n")[0]} in ${filename}`, async (t) => {
      try {
        await exec(block);
      } catch (err) {
        t.log(err); // prints log alongside the test instead of immediately printing them to stdout
        t.fail();
      }

      t.pass();
    });
  }
};

const files = ["./readme.md", "API.md"];

files.forEach((file, index) => {
  const content = readFileSync(file).toString();
  testAllCodeSnippets(content, files[index]);
});

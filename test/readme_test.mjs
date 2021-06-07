// @format
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { testmd } from "test-readme-md";
import test from "ava";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
test("run all examples in readme", async t => {
  let content = readFileSync("./readme.md").toString();
  content = content.replace(
    new RegExp("eth-fun", "g"),
    `file://${path.resolve(__dirname, "../src/index.mjs")}`
  );

  try {
    await testmd("js", content);
  } catch (err) {
    console.log(err);
    t.fail();
  }

  t.pass();
});

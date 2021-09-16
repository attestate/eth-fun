// @format
import test from "ava";

import { compile } from "../src/index.js";

test("if compile can assembly a JSON file from a valid solidity code", t => {
  const code =
    "pragma solidity ^0.6.12;\n contract C { function f() public { } function g(address a) public { } }";
  const compiled = compile(code);
  t.truthy(compiled);
  t.truthy(compiled.contracts);
  t.falsy(compiled.sources);
  t.truthy(compiled.errors);
});

test("if compile throws an error with explaination when the code couldn't be compiled", t => {
  const code =
    "pragma solidity ^0.6.12;\n contract C { function f() { } function g() {} }";
  const error = t.throws(() => compile(code));
  t.true(
    error
      .toString()
      .includes("contract:2:15: SyntaxError: No visibility specified.")
  );
  t.true(
    error
      .toString()
      .includes("contract:2:32: SyntaxError: No visibility specified.")
  );
});

// @format
import test from "ava";

import { allFunctions, compile } from "../src/index.mjs";

test("if allFunctions compiles Solidity code", t => {
  const code =
    "pragma solidity ^0.6.12;\n contract C { function f() public { } function g(address a) public { } }";
  const { contracts } = compile(code);
  const fns = allFunctions(contracts);
  t.is(Object.keys(fns).length, 1);
  t.is(fns["C"][0].type, "function");
  t.is(fns["C"][0].name, "f");
  t.is(fns["C"][1].type, "function");
  t.is(fns["C"][1].name, "g");
});

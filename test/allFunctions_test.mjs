// @format
import test from "ava";

import allFunctions from "../src/allFunctions.mjs";

test("if allFunctions compiles Solidity code", t => {
  const code =
    "pragma solidity ^0.6.12;\n contract C { function f() public { } function g(address a) public { } }";
  const fns = allFunctions(code);
  console.log(fns);
  t.is(fns.length, 2);
  t.is(fns[0].type, "function");
  t.is(fns[0].name, "f");
  t.is(fns[1].type, "function");
  t.is(fns[1].name, "g");
});

test("if allFunctions throws an error with explaination when the code couldn't be compiled", t => {
  const code = "pragma solidity ^0.6.12;\n contract C { function f() { } }";
  t.throws(() => allFunctions(code));
});

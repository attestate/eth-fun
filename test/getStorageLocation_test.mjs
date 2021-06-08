// @format
import test from "ava";

import { getStorageLocation, compile } from "../src/index.mjs";

test("if getStorageLocation returns a variable's storage location", t => {
  const code = "pragma solidity ^0.6.12;\ncontract A { uint x; }";
  const { contracts } = compile(code);
  const label = "x";
  const loc = getStorageLocation(contracts["A"], label);
  t.is(loc.label, label);
  t.true("type" in loc);
  t.true("slot" in loc);
  t.true("offset" in loc);
});

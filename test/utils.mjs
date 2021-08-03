// @format
import test from "ava";

import { toHex } from "../src/utils.mjs";

test("to hex string", t => {
  t.is(toHex(1), "0x1");
  t.is(toHex(17), "0x11");
  t.is(toHex(32), "0x20");
});

// @format
import test from "ava";

import { toHex } from "../src/utils.js";
import { ValueError } from "../src/errors.js";

test("that empty string and other unfitting values throw", (t) => {
  t.throws(() => toHex(""), { instanceOf: ValueError });
  t.throws(() => toHex(), { instanceOf: ValueError });
  t.throws(() => toHex(null), { instanceOf: ValueError });
  t.throws(() => toHex({}), { instanceOf: ValueError });
  t.throws(() => toHex([]), { instanceOf: ValueError });
  t.throws(() => toHex(() => {}), { instanceOf: ValueError });
});

test("to hex string", (t) => {
  t.is(toHex(1), "0x1");
  t.is(toHex(17), "0x11");
  t.is(toHex(32), "0x20");
});

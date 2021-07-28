// @format
import test from "ava";

import {errors, ethCall, encodeCallSignature, decodeCallOutput} from "../src/index.mjs";

test("importing errors", t => {
  t.truthy(errors.RPCError);
});

test("importing eth call and utility functions", t => {
  t.truthy(ethCall);
  t.truthy(encodeCallSignature);
  t.truthy(decodeCallOutput);
});

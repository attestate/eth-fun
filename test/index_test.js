// @format
import test from "ava";

import {errors, call, encodeCallSignature, decodeCallOutput} from "../src/index.js";

test("importing errors", t => {
  t.truthy(errors.RPCError);
});

test("importing eth call and utility functions", t => {
  t.truthy(call);
  t.truthy(encodeCallSignature);
  t.truthy(decodeCallOutput);
});

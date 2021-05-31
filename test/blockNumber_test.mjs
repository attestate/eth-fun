// @format
import test from "ava";

import getBlockNumber from "../src/blockNumber.mjs";

const node = "https://cloudflare-eth.com";

test("getting block number", async t => {
  const no = await getBlockNumber(node);
  t.is(typeof no, "string");
  t.true(no.includes("0x"));
});

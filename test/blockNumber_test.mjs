// @format
import test from "ava";

import getBlockNumber from "../src/blockNumber.mjs";

test("getting block number", async t => {
  const options = {
    url: "https://cloudflare-eth.com",
  };
  const no = await getBlockNumber(options);
  t.is(typeof no, "string");
  t.true(no.includes("0x"));
});

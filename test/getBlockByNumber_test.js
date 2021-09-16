// @format
import test from "ava";

import { blockNumber, getBlockByNumber } from "../src/index.js";

test("getting a block full of transactions", async t => {
  const options = {
    url: "https://cloudflare-eth.com"
  };
  const currentNumber = await blockNumber(options);
  const includeTxBody = false;
  const block = await getBlockByNumber(options, currentNumber, includeTxBody);
  t.truthy(block);
  t.truthy(block.transactions);
  t.assert(block.transactions.length > 0);
  t.assert(typeof block.transactions[0] === "string");
});

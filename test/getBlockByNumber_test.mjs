// @format
import test from "ava";

import { blockNumber, getBlockByNumber} from "../src/index.mjs";

const node = "https://cloudflare-eth.com";

test("getting a block full of transactions", async t => {
  const currentNumber = await blockNumber(node);
  const includeTxBody = false;
  const block = await getBlockByNumber(node, currentNumber, includeTxBody);
  t.truthy(block);
  t.truthy(block.transactions);
  t.assert(block.transactions.length > 0);
  t.assert(typeof block.transactions[0] === "string");
});

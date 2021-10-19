// @format
import test from "ava";
import esmock from "esmock";
import fetchMock from "fetch-mock";

import constants from "../src/constants.js";

test("getting a block full of transactions", async (t) => {
  const options = {
    url: "https://cloudflare-eth.com",
  };
  const currentNumber = "0xcd2057";
  const includeTxBody = false;

  const { getBlockByNumber } = await esmock("../src/index.js", null, {
    "cross-fetch": {
      default: fetchMock.sandbox().post(
        {
          url: options.url,
          body: {
            method: "eth_getBlockByNumber",
            params: [currentNumber, includeTxBody],
            ...constants,
          },
        },
        {
          result: {
            transactions: [
              "0x2495242be275427e68efe7be41d1487dba505642f349d99bca63bc17787661c8",
            ],
          },
        }
      ),
    },
  });

  const block = await getBlockByNumber(options, currentNumber, includeTxBody);
  t.truthy(block);
  t.truthy(block.transactions);
  t.assert(block.transactions.length > 0);
  t.assert(typeof block.transactions[0] === "string");
});

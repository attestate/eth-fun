// @format
import test from "ava";
import esmock from "esmock";
import fetchMock from "fetch-mock";

import constants from "../src/constants.js";

test("downloading a transaction receipt", async (t) => {
  const options = {
    url: "https://cloudflare-eth.com",
  };
  const txId =
    "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238";

  const { getTransactionReceipt } = await esmock("../src/index.js", null, {
    "cross-fetch": {
      default: fetchMock.sandbox().post(
        {
          url: options.url,
          body: {
            method: "eth_getTransactionReceipt",
            params: [txId],
            ...constants,
          },
        },
        {
          result: {
            transactionHash:
              "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
            transactionIndex: "0x1",
            blockNumber: "0xb",
            blockHash:
              "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
            cumulativeGasUsed: "0x33bc",
            gasUsed: "0x4dc",
            contractAddress: "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
            logs: [],
            logsBloom: "0x00...0",
            status: "0x1",
          },
        }
      ),
    },
  });

  const receipt = await getTransactionReceipt(options, txId);
  t.truthy(receipt);
  t.truthy(receipt.transactionHash);
});

// @format
import test from "ava";
import esmock from "esmock";
import fetchMock from "fetch-mock";

import constants from "../src/constants.js";

test("downloading a transaction", async (t) => {
  const options = {
    url: "https://cloudflare-eth.com",
  };
  const txId =
    "0xb1fac2cb5074a4eda8296faebe3b5a3c10b48947dd9a738b2fdf859be0e1fbaf";

  const { getTransactionByHash } = await esmock("../src/index.js", null, {
    "cross-fetch": {
      default: fetchMock.sandbox().post(
        {
          url: options.url,
          body: {
            method: "eth_getTransactionByHash",
            params: [txId],
            ...constants,
          },
        },
        {
          result: {
            blockHash:
              "0xb1112ef37861f39ff395a245eb962791e11eae26f94b50bb95e3e31378ef3d25",
            blockNumber: "0xfd27df",
            from: "0x2d218ce7d8892fc6b391b614f84278d12decae52",
            gas: "0xf478",
            gasPrice: "0x5bcdcacee",
            maxFeePerGas: "0x645a4b0a6",
            maxPriorityFeePerGas: "0x173eed80",
            hash: "0xb1fac2cb5074a4eda8296faebe3b5a3c10b48947dd9a738b2fdf859be0e1fbaf",
            input:
              "0xa9059cbb000000000000000000000000b6ae07829376a5b704bb46a0869f383555097c29000000000000000000000000000000000000000000000034df6db862352c72d0",
            nonce: "0x2768",
            to: "0x111111517e4929d3dcbdfa7cce55d30d4b6bc4d6",
            transactionIndex: "0xb4",
            value: "0x0",
            type: "0x2",
            accessList: [],
            chainId: "0x1",
            v: "0x1",
            r: "0x4dec2c2ab964f28385d31cd203fe5960e001ccd110db816ad462d411cf496548",
            s: "0x62ffcab5b6ae1cf4a59d32dd39a92f14eadea5fbbb7587c1a845a3d0d8621253",
            yParity: "0x1",
          },
        }
      ),
    },
  });

  const receipt = await getTransactionByHash(options, txId);
  t.truthy(receipt);
  t.truthy(receipt.hash);
  t.truthy(receipt.value);
});

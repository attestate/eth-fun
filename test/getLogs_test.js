import test from "ava";
import esmock from "esmock";
import fetchMock from "fetch-mock";

const options = {
  url: "https://nodes.mewapi.io/rpc/eth",
};

test("fetch logs from a given range of block numbers", async (t) => {
  const fromBlock = "0xc60891";
  const toBlock = null;
  const address = "0x8b0acaa0cdc89f0a76acd246177dd75b9614af43";
  const topics = [
    "0xe1c4fa794edfa8f619b8257a077398950357b9c6398528f94480307352f9afcc",
  ];

  const mockOutput = [
    {
      address: "0x8b0acaa0cdc89f0a76acd246177dd75b9614af43",
      blockHash:
        "0xad5fc40d69d8e14a98653052b9dcca6b374d07a5a13f99fb8de90efd7e222574",
      blockNumber: "0xc60891",
      data: "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000610e8fd400000000000000000000000000000000000000000000000000038d7ea4c68000",
      logIndex: "0x80",
      removed: false,
      topics: [
        "0xe1c4fa794edfa8f619b8257a077398950357b9c6398528f94480307352f9afcc",
        "0x000000000000000000000000bbd33afa85539fa65cc08a2e61a001876d2f13fe",
        "0x000000000000000000000000bbd33afa85539fa65cc08a2e61a001876d2f13fe",
        "0x000000000000000000000000903322c7e45a60d7c8c3ea236c5bea9af86310c7",
      ],
      transactionHash:
        "0x231a00b46517e6a53c5a05f7c2053319d610ef25f7066e1f90434aaa353f40e4",
      transactionIndex: "0xa0",
    },
  ];

  const getLogs = await esmock("../src/getLogs.js", null, {
    "cross-fetch": {
      default: fetchMock.sandbox().post(
        {
          url: options.url,
          body: {
            method: "eth_getLogs",
            params: [{ fromBlock, address, topics }],
            id: 1,
            jsonrpc: "2.0",
          },
        },
        { result: mockOutput }
      ),
    },
  });

  const output = await getLogs(options, {
    fromBlock,
    toBlock,
    address,
    topics,
  });

  t.deepEqual(output, mockOutput);
});

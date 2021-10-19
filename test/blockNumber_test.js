// @format
import test from "ava";
import esmock from "esmock";
import fetchMock from "fetch-mock";

test("getting block number", async (t) => {
  const options = {
    url: "https://cloudflare-eth.com",
  };

  const { default: getBlockNumber } = await esmock(
    "../src/blockNumber.js",
    null,
    {
      "cross-fetch": {
        default: fetchMock.sandbox().post(
          {
            url: options.url,
            body: {
              method: "eth_blockNumber",
            },
            matchPartialBody: true,
          },
          {
            result: "0xcd2057",
          }
        ),
      },
    }
  );

  const no = await getBlockNumber(options);
  t.is(typeof no, "string");
  t.true(no.includes("0x"));
});

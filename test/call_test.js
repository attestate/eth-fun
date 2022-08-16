// @format
import test from "ava";
import esmock from "esmock";
import fetchMock from "fetch-mock";
import AbortController from "abort-controller";

import { encodeFunctionCall, decodeParameters } from "../src/index.js";
import { RPCError } from "../src/errors.js";
import constants from "../src/constants.js";

test("decoding log", async (t) => {
  const { decodeLog } = await import("../src/call.js");
  const data =
    "0x000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000054c7972616800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000054c59524148000000000000000000000000000000000000000000000000000000";
  // Note: https://web3js.readthedocs.io/en/v1.4.0/web3-eth-abi.html#id22
  // `topics` must not include the topic0 "if its a non-anonymous event".
  const topics = [
    "0x000000000000000000000000ca13eaa6135d719e743ffebb5c26de4ce2f9600c",
  ];
  const result = decodeLog(
    [
      {
        type: "uint256",
        name: "artistId",
      },
      {
        type: "string",
        name: "name",
      },
      {
        type: "string",
        name: "symbol",
      },
      {
        type: "address",
        name: "artistAddress",
        indexed: true,
      },
    ],
    data,
    topics
  );
  t.is(result.artistAddress, "0xcA13Eaa6135D719e743ffebb5C26de4CE2F9600c");
});

test("if web3-eth-abi is exported", async (t) => {
  const {
    eventFunctionSignature,
    encodeFunctionSignature,
    encodeParameters,
    decodeParameters,
    decodeLog,
  } = await import("../src/call.js");
  t.is(typeof encodeFunctionCall, "function");
  t.is(typeof encodeFunctionSignature, "function");
  t.is(typeof encodeParameters, "function");
  t.is(typeof decodeParameters, "function");
  t.is(typeof eventFunctionSignature, "function");
  t.is(typeof decodeLog, "function");
});

test("eth_call with non-hex block number tag must not return undefined", async (t) => {
  const from = "0x005241438cAF3eaCb05bB6543151f7AF894C5B58";
  const to = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const values = [from];
  const blockNumber = "1234";
  const data = encodeFunctionCall(
    {
      name: "balanceOf",
      type: "function",
      inputs: [{ type: "address", name: "owner" }],
    },
    values
  );
  const options = {
    url: "https://cloudflare-eth.com",
  };

  const { call } = await import("../src/call.js");
  await t.throwsAsync(
    async () => await call(options, from, to, data, blockNumber)
  );
});

test("if decoding a eth call result works", (t) => {
  const types = ["uint256"];
  const output =
    "0x00000000000000000000000000000000000000000000000041eb63d55b1b0000";
  const expected = "4750000000000000000";
  t.is(expected / Math.pow(10, 18), 4.75);
  const [res] = decodeParameters(types, output);
  t.is(res, expected);
});

test("if eth_call can be aborted by timeout", async (t) => {
  const from = "0x005241438cAF3eaCb05bB6543151f7AF894C5B58";
  const to = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const selector = "balanceOf(address)";
  const values = [from];
  const blockNumber = "latest";
  const data = encodeFunctionCall(
    {
      name: "balanceOf",
      type: "function",
      inputs: [{ type: "address", name: "owner" }],
    },
    values
  );
  const mockOptions = {
    url: "https://cloudflare-eth.com",
  };

  const delay = 1000;
  const { call } = await esmock("../src/call.js", null, {
    "cross-fetch": {
      default: fetchMock.sandbox().post(
        {
          url: mockOptions.url,
          body: {
            method: "eth_call",
            params: [{ from, to, data }, blockNumber],
            ...constants,
          },
        },
        {
          result:
            "0x00000000000000000000000000000000000000000000000041eb63d55b1b0000",
        },
        {
          delay,
        }
      ),
    },
  });

  const controller = new AbortController();
  const options = {
    ...mockOptions,
    signal: controller.signal,
  };
  const maxTimeout = 500;
  let timer = setTimeout(() => controller.abort(), maxTimeout);
  await t.throwsAsync(
    async () => await call(options, from, to, data, blockNumber)
  );
  clearTimeout(timer);
});

test("if getBalance eth_call works on DSS contract", async (t) => {
  const from = "0x005241438cAF3eaCb05bB6543151f7AF894C5B58";
  const to = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const selector = "balanceOf(address)";
  const values = [from];
  const blockNumber = "latest";
  const data = encodeFunctionCall(
    {
      name: "balanceOf",
      type: "function",
      inputs: [{ type: "address", name: "owner" }],
    },
    values
  );
  const options = {
    url: "https://cloudflare-eth.com",
  };

  const { call } = await esmock("../src/call.js", null, {
    "cross-fetch": {
      default: fetchMock.sandbox().post(
        {
          url: options.url,
          body: {
            method: "eth_call",
            params: [{ from, to, data }, blockNumber],
            ...constants,
          },
        },
        {
          result:
            "0x00000000000000000000000000000000000000000000000041eb63d55b1b0000",
        }
      ),
    },
  });

  const output = await call(options, from, to, data, blockNumber);
  t.truthy(output);
  // TODO: Figure out why the result for balanceOf is 64 digits and not 32
  t.is(output.length, 66);

  const outputTypes = ["uint256"];
  const [res] = decodeParameters(outputTypes, output);
  const expected = "4750000000000000000";
  t.is(res, expected);
});

test("if null can be passed to from and call still works", async (t) => {
  const from = null;
  const to = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const selector = "balanceOf(address)";
  const values = ["0x005241438cAF3eaCb05bB6543151f7AF894C5B58"];
  const blockNumber = "latest";
  const data = encodeFunctionCall(
    {
      name: "balanceOf",
      type: "function",
      inputs: [{ type: "address", name: "owner" }],
    },
    values
  );
  const options = {
    url: "https://cloudflare-eth.com",
  };

  const { call } = await esmock("../src/call.js", null, {
    "cross-fetch": {
      default: fetchMock.sandbox().post(
        {
          url: options.url,
          body: {
            method: "eth_call",
            params: [{ to, data }, blockNumber],
            ...constants,
          },
        },
        {
          result:
            "0x00000000000000000000000000000000000000000000000041eb63d55b1b0000",
        }
      ),
    },
  });

  const output = await call(options, from, to, data, blockNumber);
  t.truthy(output);
  // TODO: Figure out why the result for balanceOf is 64 digits and not 32
  t.is(output.length, 66);

  const outputTypes = ["uint256"];
  const [res] = decodeParameters(outputTypes, output);
  const expected = "4750000000000000000";
  t.is(res, expected);
});

// @format
import test from "ava";
import esmock from "esmock";
import fetchMock from "fetch-mock";

import { encodeCallSignature, decodeCallOutput } from "../src/call.js";
import constants from "../src/constants.js";

test("if encoding a eth call works", (t) => {
  const selector = "baz(uint32,bool)";
  const types = ["uint32", "bool"];
  const values = [69, true];

  // REFERENCE: https://docs.soliditylang.org/en/develop/abi-spec.html#examples
  const expected =
    "0xcdcd77c000000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001";
  t.is(encodeCallSignature(selector, types, values), expected);
});

test("if decoding a eth call result works", (t) => {
  const types = ["uint256"];
  const output =
    "0x00000000000000000000000000000000000000000000000041eb63d55b1b0000";
  const expected = "4750000000000000000";
  t.is(expected / Math.pow(10, 18), 4.75);
  const [res] = decodeCallOutput(types, output);
  t.is(res, expected);
});

test("if getBalance eth_call works on DSS contract", async (t) => {
  const from = "0x005241438cAF3eaCb05bB6543151f7AF894C5B58";
  const to = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const selector = "balanceOf(address)";
  const inputTypes = ["address"];
  const values = [from];
  const blockNumber = "latest";
  const data = encodeCallSignature(selector, inputTypes, values);
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
  const [res] = decodeCallOutput(outputTypes, output);
  const expected = "4750000000000000000";
  t.is(res, expected);
});

test("if null can be passed to from and call still works", async (t) => {
  const from = null;
  const to = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const selector = "balanceOf(address)";
  const inputTypes = ["address"];
  const values = ["0x005241438cAF3eaCb05bB6543151f7AF894C5B58"];
  const blockNumber = "latest";
  const data = encodeCallSignature(selector, inputTypes, values);
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
  const [res] = decodeCallOutput(outputTypes, output);
  const expected = "4750000000000000000";
  t.is(res, expected);
});

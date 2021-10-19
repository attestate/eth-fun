// @format
import test from "ava";
import esmock from "esmock";
import fetchMock from "fetch-mock";

import { toHex } from "../src/utils.js";
import { bodyFactory } from "../src/getStorageAt.js";

const addr = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

test("body factory", (t) => {
  const index = 1;
  const blockNo = "latest";
  const contract = "abc";
  const res = bodyFactory(contract, index, blockNo);
  t.is(res.params[1], toHex(index));
  t.truthy(res.params[2]);
});

test("if getting index works", async (t) => {
  const index = 1;
  const blockNo = "latest";

  const options = {
    url: "https://cloudflare-eth.com",
  };

  const { getStorageAt } = await esmock("../src/getStorageAt.js", null, {
    "cross-fetch": {
      default: fetchMock.sandbox().post(
        {},
        {
          result:
            "0x0000000000000000000000001a9c8182c09f50c8318d769245bea52c32be35bc",
        }
      ),
    },
  });

  const storage = await getStorageAt(options, addr, index, blockNo);
  t.is(storage.length, 64 + 2);
});

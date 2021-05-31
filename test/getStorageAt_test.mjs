// @format
import test from "ava";

import { toHex, bodyFactory, getStorageAt } from "../src/getStorageAt.mjs";

const node = "https://cloudflare-eth.com";
const addr = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

test("body factory", t => {
  const index = 1;
  const blockNo = "latest";
  const contract = "abc";
  const res = bodyFactory(contract, index, blockNo);
  t.is(res.params[1], toHex(index));
  t.truthy(res.params[2]);
});

test("if getting index works", async t => {
  const index = 1;
  const blockNo = "latest";
  const storage = await getStorageAt(node, addr, index, blockNo);
  t.is(storage.length, 64 + 2);
});

test("to hex string", t => {
  t.is(toHex(1), "0x1");
  t.is(toHex(17), "0x11");
  t.is(toHex(32), "0x20");
});

// @format
import fetch from "cross-fetch";

import { send } from "./transport.mjs";
import constants from "./constants.mjs";

const { id, jsonrpc } = constants;

// Spec: https://openethereum.github.io/JSONRPC-eth-module#eth_getstorageat
export function bodyFactory(addr, index, blockNo) {
  if (typeof blockNo !== "string") {
    blockNo = toHex(blockNo);
  }

  return {
    method: "eth_getStorageAt",
    params: [addr, toHex(index), blockNo],
    id,
    jsonrpc
  };
}

export function toHex(num) {
  return `0x${num.toString(16)}`;
}

export async function getStorageAt(node, addr, index, blockNo) {
  const body = bodyFactory(addr, index, blockNo);
  return await send(node, body);
}

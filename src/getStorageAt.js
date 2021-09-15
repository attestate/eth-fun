// @format
import fetch from "cross-fetch";

import { send } from "./transport.js";
import constants from "./constants.js";
import { toHex } from "./utils.js";

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

export async function getStorageAt(node, addr, index, blockNo) {
  const body = bodyFactory(addr, index, blockNo);
  return await send(node, body);
}

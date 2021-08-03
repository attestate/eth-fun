// @format
import { send } from "./transport.mjs";
import constants from "./constants.mjs";
import { toHex } from "./utils.mjs";

const { id, jsonrpc } = constants;

export default async function getBlockByNumber(
  node,
  blockNumber,
  includeTxBodies
) {
  return await send(node, {
    method: "eth_getBlockByNumber",
    params: [blockNumber, includeTxBodies],
    id,
    jsonrpc
  });
}

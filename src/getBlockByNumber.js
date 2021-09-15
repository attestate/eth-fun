// @format
import { send } from "./transport.js";
import constants from "./constants.js";
import { toHex } from "./utils.js";

const { id, jsonrpc } = constants;

export default async function getBlockByNumber(
  options,
  blockNumber,
  includeTxBodies
) {
  return await send(options, {
    method: "eth_getBlockByNumber",
    params: [blockNumber, includeTxBodies],
    id,
    jsonrpc
  });
}

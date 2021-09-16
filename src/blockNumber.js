// @format
import { send } from "./transport.js";
import constants from "./constants.js";

const { id, jsonrpc } = constants;

export default async function getBlockNo(options) {
  const body = blockNoFactory();
  return await send(options, body);
}

function blockNoFactory() {
  return { method: "eth_blockNumber", params: [], id, jsonrpc };
}

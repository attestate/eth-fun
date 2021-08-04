// @format
import { send } from "./transport.mjs";
import constants from "./constants.mjs";

const { id, jsonrpc } = constants;

export default async function getBlockNo(options) {
  const body = blockNoFactory();
  return await send(options, body);
}

function blockNoFactory() {
  return { method: "eth_blockNumber", params: [], id, jsonrpc };
}

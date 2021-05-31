// @format
import { send } from "./transport.mjs";
import constants from "./constants.mjs";

const { id, jsonrpc } = constants;

export default async function getBlockNo(node) {
  const body = blockNoFactory();
  return await send(node, body);
}

function blockNoFactory() {
  return { method: "eth_blockNumber", params: [], id, jsonrpc };
}

import constants from "./constants.js";
import { send } from "./transport.js";

const { id, jsonrpc } = constants;

/**
 * See https://openethereum.github.io/JSONRPC-eth-module#eth_getlogs
 *
 * @param {*} options
 * @param {*} filterObject
 * @returns
 */
export default async function getLogs(
  options,
  { fromBlock, toBlock, address, topics, limit } = {}
) {
  const body = {
    method: "eth_getLogs",
    params: [{ fromBlock, toBlock, address, topics, limit }],
    id,
    jsonrpc,
  };

  // Remove falsy values from params
  // We don't want to send null values
  for (const value in body.params[0]) {
    if (!body.params[0][value]) {
      delete body.params[0][value];
    }
  }

  return await send(options, body);
}

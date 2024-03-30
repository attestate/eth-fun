// @format
import { send } from "./transport.js";
import constants from "./constants.js";

export default async function getTransactionByHash(options, txId) {
  return await send(options, {
    method: "eth_getTransactionByHash",
    params: [txId],
    ...constants,
  });
}

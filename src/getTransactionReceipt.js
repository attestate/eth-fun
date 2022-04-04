// @format
import { send } from "./transport.js";
import constants from "./constants.js";

export default async function getTransactionReceipt(options, txId) {
  return await send(options, {
    method: "eth_getTransactionReceipt",
    params: [txId],
    ...constants,
  });
}

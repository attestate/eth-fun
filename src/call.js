// @format
import { send } from "./transport.js";
import constants from "./constants.js";

const { id, jsonrpc } = constants;

import abi from "web3-eth-abi";
const encodeFunctionSignature = (...args) =>
  abi.encodeFunctionSignature(...args);
const encodeFunctionCall = (...args) => abi.encodeFunctionCall(...args);
const encodeParameters = (...args) => abi.encodeParameters(...args);
const decodeParameters = (types, output) => {
  const res = abi.decodeParameters(types, output);

  const parsedResults = [];
  for (let i = 0; i < res.__length__; i++) {
    parsedResults.push(res[i]);
  }

  return parsedResults;
};
const eventFunctionSignature = (...args) => abi.eventFunctionSignature(...args);

export {
  encodeFunctionSignature,
  encodeFunctionCall,
  encodeParameters,
  decodeParameters,
  eventFunctionSignature,
};

export async function call(options, from, to, data, blockNumber = "latest") {
  const body = {
    method: "eth_call",
    params: [
      {
        from,
        to,
        data,
      },
      blockNumber,
    ],
    id,
    jsonrpc,
  };

  // NOTE: `from` is optional in json-rpc specification. But if we pass `null`
  // to the RPC endpoint, it returns an error - which is why we remove `from`
  // if it's a falsy value.
  if (!from) {
    delete body.params[0].from;
  }

  return await send(options, body);
}

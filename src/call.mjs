// @format
import abi from "web3-eth-abi";

import { send } from "./transport.mjs";
import constants from "./constants.mjs";

const { id, jsonrpc } = constants;

export function encodeCallSignature(selector, types, values) {
  let data = abi.encodeFunctionSignature(selector);
  const encodedParams = abi.encodeParameters(types, values);

  // NOTE: `encodeParams` preprends `0x` to all return values
  data += encodedParams.substring(2, encodedParams.length);
  return data;
}

export function decodeCallOutput(types, output) {
  const res = abi.decodeParameters(types, output);

  const parsedResults = [];
  for (let i = 0; i < res.__length__; i++) {
    parsedResults.push(res[i]);
  }

  return parsedResults;
}

export async function call(
  options,
  from,
  to,
  data,
  blockNumber="latest"
) {
  const body = {
    method: "eth_call",
    params: [
      {
        from,
        to,
        data
      },
      blockNumber
    ],
    id,
    jsonrpc
  };

  // NOTE: `from` is optional in json-rpc specification. But if we pass `null`
  // to the RPC endpoint, it returns an error - which is why we remove `from`
  // if it's a falsy value.
  if (!from) {
    delete body.params[0].from;
  }

  return await send(options, body);
}

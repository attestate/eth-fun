var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/index.js
__export(exports, {
  blockNumber: () => getBlockNo,
  call: () => call,
  decodeLog: () => decodeLog,
  decodeParameters: () => decodeParameters,
  encodeFunctionCall: () => encodeFunctionCall,
  encodeFunctionSignature: () => encodeFunctionSignature,
  encodeParameters: () => encodeParameters,
  errors: () => errors,
  getBlockByNumber: () => getBlockByNumber,
  getLogs: () => getLogs,
  getStorageAt: () => getStorageAt,
  getTransactionByHash: () => getTransactionByHash,
  getTransactionReceipt: () => getTransactionReceipt,
  nodes: () => nodes_default,
  toHex: () => toHex
});

// src/transport.js
var import_cross_fetch = __toModule(require("cross-fetch"));

// src/errors.js
var RPCError = class extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RPCError);
    }
    this.name = "RPCError";
  }
};
var ValueError = class extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValueError);
    }
    this.name = "ValueError";
  }
};

// src/transport.js
async function send(options, body) {
  let headers = Object.assign({}, { "Content-Type": "application/json" });
  if (options && options.headers) {
    headers = Object.assign(headers, options.headers);
  }
  let url;
  if (!options.url) {
    throw new Error("`url` is a required property of `options`");
  } else {
    url = options.url;
  }
  const res = await (0, import_cross_fetch.default)(url, {
    method: "POST",
    headers,
    signal: options.signal,
    body: JSON.stringify(body)
  });
  if (res.status === 403) {
    const answer = await res.text();
    if (answer.includes("invalid host specified")) {
      throw new RPCError(`Status: 403 Forbidden; Ethereum node answered with: "${answer}".`);
    } else {
      throw new Error("Unexpected error. Please report on eth-fun repository.");
    }
  }
  if (res.status >= 500) {
    throw new RPCError(`RPC endpoint sent status: "${res.status}"`);
  }
  const result = await res.text();
  let data;
  try {
    data = JSON.parse(result);
  } catch (err) {
    throw new RPCError(`Encountered error when trying to parse JSON body result: "${result}", error: "${err.toString()}"`);
  }
  if (data.error && data.error.message) {
    throw new RPCError(`Error from fullnode: ${data.error.message}`);
  }
  return data.result;
}

// src/constants.js
var constants = {
  id: 1,
  jsonrpc: "2.0"
};
var constants_default = constants;

// src/blockNumber.js
var { id, jsonrpc } = constants_default;
async function getBlockNo(options) {
  const body = blockNoFactory();
  return await send(options, body);
}
function blockNoFactory() {
  return { method: "eth_blockNumber", params: [], id, jsonrpc };
}

// src/utils.js
function toHex(num) {
  if (typeof num !== "number")
    throw new ValueError(`toHex expects typeof "number", input type: "${typeof num}"`);
  return `0x${num.toString(16)}`;
}

// src/getBlockByNumber.js
var { id: id2, jsonrpc: jsonrpc2 } = constants_default;
async function getBlockByNumber(options, blockNumber, includeTxBodies) {
  return await send(options, {
    method: "eth_getBlockByNumber",
    params: [blockNumber, includeTxBodies],
    id: id2,
    jsonrpc: jsonrpc2
  });
}

// src/getTransactionReceipt.js
async function getTransactionReceipt(options, txId) {
  return await send(options, __spreadValues({
    method: "eth_getTransactionReceipt",
    params: [txId]
  }, constants_default));
}

// src/getTransactionByHash.js
async function getTransactionByHash(options, txId) {
  return await send(options, __spreadValues({
    method: "eth_getTransactionByHash",
    params: [txId]
  }, constants_default));
}

// src/getStorageAt.js
var import_cross_fetch2 = __toModule(require("cross-fetch"));
var { id: id3, jsonrpc: jsonrpc3 } = constants_default;
function bodyFactory(addr, index, blockNo) {
  if (typeof blockNo !== "string") {
    blockNo = toHex(blockNo);
  }
  return {
    method: "eth_getStorageAt",
    params: [addr, toHex(index), blockNo],
    id: id3,
    jsonrpc: jsonrpc3
  };
}
async function getStorageAt(node, addr, index, blockNo) {
  const body = bodyFactory(addr, index, blockNo);
  return await send(node, body);
}

// src/nodes.js
var nodes = {
  mainnet: [
    {
      name: "MyCrypto",
      endpoint: "https://api.mycryptoapi.com/eth",
      website: "https://mycrypto.com/"
    },
    {
      name: "1inch",
      endpoint: "https://web3.1inch.exchange/",
      website: "https://1inch.exchange/"
    },
    {
      name: "Cloudflare",
      endpoint: "https://cloudflare-eth.com/",
      website: "https://cloudflare-eth.com/"
    },
    {
      name: "Blockscout",
      endpoint: "https://mainnet-nethermind.blockscout.com/",
      website: "https://blockscout.com"
    },
    {
      name: "MyEtherWallet",
      endpoint: "https://nodes.mewapi.io/rpc/eth",
      website: "https://myetherwallet.com/"
    },
    {
      name: "LinkPool",
      endpoint: "https://main-rpc.linkpool.io/",
      website: "https://linkpool.io/"
    },
    {
      name: "AVADO",
      endpoint: "https://mainnet.eth.cloud.ava.do/",
      website: "https://ava.do"
    }
  ]
};
var nodes_default = nodes;

// src/call.js
var import_web3_eth_abi = __toModule(require("web3-eth-abi"));
var { id: id4, jsonrpc: jsonrpc4 } = constants_default;
var encodeFunctionSignature = (...args) => import_web3_eth_abi.default.encodeFunctionSignature(...args);
var encodeFunctionCall = (...args) => import_web3_eth_abi.default.encodeFunctionCall(...args);
var encodeParameters = (...args) => import_web3_eth_abi.default.encodeParameters(...args);
var decodeParameters = (types, output) => {
  const res = import_web3_eth_abi.default.decodeParameters(types, output);
  const parsedResults = [];
  for (let i = 0; i < res.__length__; i++) {
    parsedResults.push(res[i]);
  }
  return parsedResults;
};
var decodeLog = (...args) => import_web3_eth_abi.default.decodeLog(...args);
async function call(options, from, to, data, blockNumber = "latest") {
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
    id: id4,
    jsonrpc: jsonrpc4
  };
  if (!from) {
    delete body.params[0].from;
  }
  return await send(options, body);
}

// src/getLogs.js
var { id: id5, jsonrpc: jsonrpc5 } = constants_default;
async function getLogs(options, { fromBlock, toBlock, address, topics, limit } = {}) {
  const body = {
    method: "eth_getLogs",
    params: [{ fromBlock, toBlock, address, topics, limit }],
    id: id5,
    jsonrpc: jsonrpc5
  };
  for (const value in body.params[0]) {
    if (!body.params[0][value]) {
      delete body.params[0][value];
    }
  }
  return await send(options, body);
}

// src/index.js
var errors = {
  RPCError
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  blockNumber,
  call,
  decodeLog,
  decodeParameters,
  encodeFunctionCall,
  encodeFunctionSignature,
  encodeParameters,
  errors,
  getBlockByNumber,
  getLogs,
  getStorageAt,
  getTransactionByHash,
  getTransactionReceipt,
  nodes,
  toHex
});

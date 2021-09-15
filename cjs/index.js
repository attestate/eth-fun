(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __require = typeof require !== "undefined" ? require : (x) => {
    throw new Error('Dynamic require of "' + x + '" is not supported');
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // src/allFunctions.js
  function allFunctions(contracts) {
    let fns = {};
    for (let [key, impl] of Object.entries(contracts)) {
      fns[key] = impl.abi.filter(({ type }) => type === "function");
    }
    return fns;
  }

  // src/getStorageLocation.js
  function getStorageLocation(contract, soughtLabel) {
    const { storageLayout } = contract;
    return storageLayout.storage.find(({ label }) => label === soughtLabel);
  }

  // src/compile.js
  var import_solc = __toModule(__require("solc"));
  function compile(code, options = {}) {
    let input = {
      language: "Solidity",
      sources: {
        contract: {
          content: code
        }
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"]
          }
        }
      },
      ...options
    };
    input = JSON.stringify(input);
    let out = import_solc.default.compile(input);
    out = JSON.parse(out);
    if (out && out.errors) {
      const severe = out.errors.filter(({ severity }) => severity === "error");
      if (severe.length > 0) {
        const msgs = severe.map(({ formattedMessage }) => formattedMessage).join("\n");
        throw new Error(`Compiling the code lead to (multiple) severe errors:
        ${msgs}
      `);
      }
    }
    out.contracts = out.contracts.contract;
    delete out.sources;
    return out;
  }

  // src/transport.js
  var import_cross_fetch = __toModule(__require("cross-fetch"));

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
    const data = await res.json();
    if (data.error) {
      throw new RPCError(`${data.error.message} Code: ${data.error.code}`);
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

  // src/getStorageAt.js
  var import_cross_fetch2 = __toModule(__require("cross-fetch"));
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
  var import_web3_eth_abi = __toModule(__require("web3-eth-abi"));
  var { id: id4, jsonrpc: jsonrpc4 } = constants_default;
  function encodeCallSignature(selector, types, values) {
    let data = import_web3_eth_abi.default.encodeFunctionSignature(selector);
    const encodedParams = import_web3_eth_abi.default.encodeParameters(types, values);
    data += encodedParams.substring(2, encodedParams.length);
    return data;
  }
  function decodeCallOutput(types, output) {
    const res = import_web3_eth_abi.default.decodeParameters(types, output);
    const parsedResults = [];
    for (let i = 0; i < res.__length__; i++) {
      parsedResults.push(res[i]);
    }
    return parsedResults;
  }
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

  // src/index.js
  var errors = {
    RPCError
  };
})();

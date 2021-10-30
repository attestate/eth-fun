# eth-fun

[![Node.js CI](https://github.com/rugpullindex/eth-fns/actions/workflows/node.js.yml/badge.svg)](https://github.com/rugpullindex/eth-fns/actions/workflows/node.js.yml)

> A functional library of Ethereum utility functions.

## Why Use eth-fun?

You should use eth-fun when you want to have _fun_. eth-fun is built with a
functional approach in mind. We try to build our code according to the properties
below. eth-fun's codebase shall be:

- modular and as loosely coupled as possible.
- stateless; such that we come as close as possible towards atomic,
  safely-failable (and catchable) actions.
- built with a modern front end's needs in mind. Ideally, the whole lib is
  tree-shakeable and produces the smallest footprint possible when being sent
  to a client's browser.

eth-fun is an attempt at developing Ethereum in a one-way-dataflow fashion
(similar to react.js). eth-fun is a **work-in-progress**.

## Installation

```bash
$ npm i eth-fun
```

## Usage

### `options object`

`options` are passed to any JSON-RPC call. They may contain the following
properties:

| name    | required? | default                                |
| ------- | --------- | -------------------------------------- |
| url     | yes       | `undefined`                            |
| headers | no        | `{"Content-Type": "application/json"}` |

### `await getBlockByNumber(options, blockNumber, includeTxBodies)`

Returns a block's metadata given it's `blockNumber` as a hexadecimal value.
`includeTxBody` allows to shrink the block body by only including
transaction hashes instead of all transaction bodies.

```js
import { blockNumber, getBlockByNumber } from "eth-fun";

const options = {
  url: "https://cloudflare-eth.com",
};

(async () => {
  const currentNumber = await blockNumber(options);
  const includeTxBodies = false;
  const block = await getBlockByNumber(options, currentNumber, includeTxBodies);
  console.log(block);
})();
```

### `toHex(number)`

Takes a JavaScript `Number` and converts it to its hexadecimal representation.
A `0x` is prepended to the number too;

```js
import { toHex } from "eth-fun";

const num = 20;
const hexNum = toHex(num);
console.log(hexNum);
// 0x14
```

### `encodeCallSignature(selector, types, values)`

Given some meta data about a contract's function signature, it generates a
hex-encoded Solidity string that can be passed as `data` parameter to e.g. a
`eth_call`. For reference, see Solidity's [ABI encoding
specification](https://docs.soliditylang.org/en/develop/abi-spec.html).

```js
import { encodeCallSignature } from "eth-fun";

const selector = "baz(uint32,bool)";
const types = ["uint32", "bool"];
const values = [69, true];

const signature = encodeCallSignature(selector, types, values);
console.log(signature);
// 0xcdcd77c000000000000000000000000000000000000000000000000000000000000000450000000000000000000000000000000000000000000000000000000000000001
```

### `decodeCallOutput(types, output)`

Given some meta data about a contract's function output signature, it decodes
a hex-encoded Solidity string to human-readable return values.

```js
import { decodeCallOutput } from "eth-fun";
const types = ["uint256"];
const output =
  "0x00000000000000000000000000000000000000000000000041eb63d55b1b0000";
const [returnVal] = decodeCallOutput(types, output);
console.log(returnVal);
// 4750000000000000000
```

### `async call(options, from, to, data, blockNumber)`

Executes an Ethereum message call directy and without creating a
transaction. For information to how to encode `data`, see function
description of `encodeCallSignature`. And for description on how to
decode an eth call's output, see `decodeCallOutput`.

```js
import { call } from "eth-fun";

(async () => {
  const options = {
    url: "https://cloudflare-eth.com",
  };
  const to = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const data =
    "0x70a08231000000000000000000000000005241438caf3eacb05bb6543151f7af894c5b58";

  const output = await call(options, null, to, data);
  console.log(output);
})();
```

#### Notes

- `from` is optional in the Ethereum json-rpc specification. To skip it, pass
  `null` or any other falsy JavaScript value.
- `blockNumber` is optional and defaults to `"latest"`
- May throw custom `RPCError`

### `errors object`

An object that exposes a custom error called `RPCError`, which is thrown when
the remote endpoint returns an error during a remote procedure call.

### `nodes object`

There's a number of service providers that allow users and developers to access
their node publicly and for free. eth-fun comes with a list of free nodes. A
node is only listed when no API key is required for interacting with the node.

```js
import { nodes } from "eth-fun";
console.log(nodes.mainnet[0]);
// {
//   name: "MyCrypto",
//   endpoint: "https://api.mycryptoapi.com/eth",
//   website: "https://mycrypto.com/"
// },
```

### `async blockNumber(options)`

Gets the latest block number from the Ethereum node in `url`.

```js
import { blockNumber } from "eth-fun";

const options = {
  url: "https://cloudflare-eth.com",
};

(async () => {
  const number = await blockNumber(options);
  console.log(number);
})();
```

#### Notes

- May throw custom `RPCError`

### `async getStorageAt(options, addr, index, blockNumber)`

For a given contract `addr`, retrieves the storage value at `index` for
`blockNumber`.

```js
import { getStorageAt } from "eth-fun";

const options = {
  url: "https://cloudflare-eth.com",
};
const addr = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

const number = await getStorageAt(options, addr, 0, "latest");
console.log(number);
```

#### Notes

- May throw custom `RPCError`

### `compile(code, [options])`

`compile(code, options)` takes a valid Solidity `code` string as an arguments
and compiles it using solc. It returns a modified solc output as parsed JSON.
All options used by eth-fun can be overwritten by passing an optional `options`
object. The `options` object's shape can be inferred from
[solc-js](https://github.com/ethereum/solc-js#high-level-api).

```js
import { compile } from "eth-fun";

const code =
  "pragma solidity ^0.6.12;\n contract C { function f() public { } }";
const { contracts } = compile(code);
console.log(contracts);
// {
//   C: {
//     abi: [ [Object], [Object] ],
//     devdoc: { kind: 'dev', methods: {}, version: 1 },
//     evm: { "...": "..." }
// 	}
// }
```

### `getStorageLocation(contract, label)`

Takes a compiled Solidity contract from `compile(code, [options])` and
returns the storage location of a string `label`. Check the [Solidity
docs](https://docs.soliditylang.org/en/v0.8.4/internals/layout_in_storage.html#json-output)
for further information.

```js
import { getStorageLocation, compile } from "eth-fun";

const code = "pragma solidity ^0.6.12;\ncontract A { uint x; }";
const { contracts } = compile(code);
const label = "x";
const loc = getStorageLocation(contracts["A"], label);
console.log(loc);
// {
//   astId: 3,
//   contract: 'contract:A',
//   label: 'x',
//   offset: 0,
//   slot: '0',
//   type: 't_uint256'
// }
```

### `allFunctions(compiledCode)`

`allFunctions(compiledCode)` takes in a compiled Solidity contract (see
function `compile(code)`) and returns all its functions in the standard ABI
JSON notation.

```js
import { compile, allFunctions } from "eth-fun";

const code =
  "pragma solidity ^0.6.12;\n contract C { function f() public { } }";
const { contracts } = compile(code);
const fns = allFunctions(contracts);
console.log(fns);
// {
//   C: [
//     {
//       inputs: [],
//       name: 'f',
//       outputs: [],
//       stateMutability: 'nonpayable',
//       type: 'function'
//     }
//   ]
// }
```

### `async getLogs(options, {fromBlock, toBlock, address, topics, limit })`

Returns an array of all logs matching a given filterObject. [Events](https://docs.soliditylang.org/en/develop/contracts.html?highlight=topic#events) emitted in smart contracts are stored as transaction's log.

```txt
filterObject = {
  fromBlock,
  toBlock,
  address,
  topics,
  limit,
};
```

All the options in filterObject are optional. For more details, see [_Open Ethereum Documentation_](https://openethereum.github.io/JSONRPC-eth-module#eth_getlogs).

See, [Ethereum's StackExchange](https://ethereum.stackexchange.com/a/12951) for information about events and how to filter them using topics.

```js
import { getLogs } from "eth-fun";

(async () => {
  const options = {
    url: "https://nodes.mewapi.io/rpc/eth",
  };

  const output = await getLogs(options, {
    fromBlock: "0xc60891",
    toBlock: null,
    address: "0x8b0acaa0cdc89f0a76acd246177dd75b9614af43",
    topics: [
      "0xe1c4fa794edfa8f619b8257a077398950357b9c6398528f94480307352f9afcc",
    ],
  });

  console.log(output);
})();

/*
[
  {
    address: "0x8b0acaa0cdc89f0a76acd246177dd75b9614af43",
    blockHash:
      "0xad5fc40d69d8e14a98653052b9dcca6b374d07a5a13f99fb8de90efd7e222574",
    blockNumber: "0xc60891",
    data: "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000610e8fd400000000000000000000000000000000000000000000000000038d7ea4c68000",
    logIndex: "0x80",
    removed: false,
    topics: [
      "0xe1c4fa794edfa8f619b8257a077398950357b9c6398528f94480307352f9afcc",
      "0x000000000000000000000000bbd33afa85539fa65cc08a2e61a001876d2f13fe",
      "0x000000000000000000000000bbd33afa85539fa65cc08a2e61a001876d2f13fe",
      "0x000000000000000000000000903322c7e45a60d7c8c3ea236c5bea9af86310c7",
    ],
    transactionHash:
      "0x231a00b46517e6a53c5a05f7c2053319d610ef25f7066e1f90434aaa353f40e4",
    transactionIndex: "0xa0",
  },
];
*/
```

#### Notes

- Some Ethereum nodes such as `https://cloudflare-eth.com` only support logs of the latest 128 blocks.

## Changelog

### 0.5.1

- Add `getLogs` function

### 0.5.0

- Export both ESM and CJS modules as package using "conditional exports"

### 0.4.0

- New build process allows to target CommonJS projects in e.g. node.js

### 0.3.0

- (Breaking change) Change `node` (it was a URL) function parameter to
  `options` object for all JSON-RPC functions
- (Breaking change) Rename `ethCall` to `call`
- Expose `toHex` function
- Add `getBlockByNumber` function

### 0.2.0

- (Breaking change) All RPC functions may now throw a `RPCError` in
  case the remote procedure returns an error
- Add `error object` to exports
- Add `ethCall`, `encodeCallSignature` and `decodeCallOutput` functions
  to exports

### 0.1.2

- Add `nodes object` to exports
- Add `getStorageLocation` function

### 0.1.1

- Add `getStorageAt` function
- Add `blockNumber` function

### 0.1.0

- Add `compile` function
- (Breaking change) Separate `allFunctions` and `compile` function
- (Breaking change) Change `allFunctions` function signature. Output now
  returns an object of named contracts with the list of functions.

### 0.0.1

- Initial release
- Add `allFunctions` function that returns all functions of a contract in a
  `.sol` file.

## Caveats

- Currently we're pinning
  [solc@0.6.12](https://www.npmjs.com/package/solc/v/0.6.12). For future
  versions, it'd be awesome if the version could be specified by the user.

## References

- [Ethereum Wiki json-rpc](https://eth.wiki/json-rpc/API)
- [Ethereum openrpc specification](https://playground.open-rpc.org/?uiSchema%5BappBar%5D%5Bui:splitView%5D=false&schemaUrl=https://raw.githubusercontent.com/lightclient/eth1.0-apis/main/openrpc.json&uiSchema%5BappBar%5D%5Bui:input%5D=false)
- [Geth docs RPC server](https://geth.ethereum.org/docs/rpc/server)
- [OpenEthereum JSON RPC API](https://openethereum.github.io/JSONRPC)

## License

See LICENSE file.

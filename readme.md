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

### `async blockNumber(url)`

Gets the latest block number from the Ethereum node in `url`.

```js
import { blockNumber } from "eth-fun";

const url = "https://cloudflare-eth.com";
(async () => {
  const number = await blockNumber(url);
  console.log(number)
})();
```

### `async getStorageAt(url, addr, index, blockNumber)`

For a given contract `addr`, retrieves the storage value at `index` for
`blockNumber`.

```js
import { getStorageAt } from "eth-fun";

const url = "https://cloudflare-eth.com";
const addr = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

const number = await getStorageAt(url, addr, 0, "latest");
console.log(number)
```

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

## Changelog

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
  [solc@0.6.12](https://www.npmjs.com/package/solc/v/0.6.12).  For future
  versions, it'd be awesome if the version could be specified by the user.

## License

See LICENSE file.

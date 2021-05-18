# eth-fun

[![Node.js CI](https://github.com/rugpullindex/eth-fns/actions/workflows/node.js.yml/badge.svg)](https://github.com/rugpullindex/eth-fns/actions/workflows/node.js.yml)

> A functional library of Ethereum utility functions.

## Installation

```bash
$ npm i eth-fun
```

## Usage

### `compile(code, options)`

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
> {
>   C: {
>     abi: [ [Object], [Object] ],
>     devdoc: { kind: 'dev', methods: {}, version: 1 },
>     evm: { "...": "..." }
> 	}
> }
```

### `allFunctions(compiledCode)`

`allFunctions(compiledCode)` takes in a compiled Solidity contract (see
function `compile(code)`) and returns all its functions in the standard ABI
JSON notation.

```js
import { compile, allFunctions } from "eth-fun";

const code =
  "pragma solidity ^0.6.12;\n contract C { function f() public { } }";
const { contracts }  = compile(code);
const fns = allFunctions(contracts);
console.log(fns);
> {
>   C: [
>     {
>       inputs: [],
>       name: 'f',
>       outputs: [],
>       stateMutability: 'nonpayable',
>       type: 'function'
>     }
>   ]
> }
```

## Changelog

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

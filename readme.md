# eth-fun

[![Node.js CI](https://github.com/rugpullindex/eth-fns/actions/workflows/node.js.yml/badge.svg)](https://github.com/rugpullindex/eth-fns/actions/workflows/node.js.yml)

> A functional library of Ethereum utility functions.

## Installation

```bash
$ npm i eth-fun
```

## Usage

### `allFunctions(code)`

`allFunctions(code)` takes in valid Solidity code as an argument, compiles it
and returns all functions in the code as they appear in the generated ABI.

```js
import { allFunctions } from "eth-fun";

const code =
  "pragma solidity ^0.6.12;\n contract C { function f() public { } }";
const fns = allFunctions(code);
console.log(fns);
>  [
>    {
>      inputs: [],
>      name: 'f',
>      outputs: [],
>      stateMutability: 'nonpayable',
>      type: 'function'
>    }
>  ]
```

## Changelog

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

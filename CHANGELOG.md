# Changelog

### 0.9.3

- Add support for `eth_getTransactionByHash` RPC method

### 0.9.2

- Add support for [weiroll](https://github.com/weiroll/weiroll)

### 0.9.1

- Add `decodeLog`

### 0.9.0

- (breaking) Replace `function encodeCallSignature(...)` with `function encodeFunctionCall(...)`
- (breaking) Replace `function decodeCallOutput(...)` with `function decodeParameters(...)`
- From `web3-eth-abi` package, add:
  - `function encodeFunctionSignature(...)`
  - `function encodeEventSignature(...)`
  - `function encodeParameters(...)`
- Add a note about the absence of `function fromHex(number)`
- Relax node engine requirements in `package.json`

### 0.8.0

- (breaking) When an Ethereum full node call results in a HTTP status `200 OK`
  but the payload contained an error `{error: { code: "XXXX", message: "error message"}}` we didn't throw but returned `results: undefined` which was
  undefined behavior.
- In `options`, allow users to define
  [`AbortController.signal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal)
  to self-manage the lifecycle of a fetch request.

### 0.7.1

- For any kind of call to an Ethereum full node, when doing an RPC call, when
  the HTTP request returned a status 200, but the body didn't contain a valid
  JSON object, eth-fun emitted a `FetchError` that didn't show the text body to
  the developer. eth-fun now includes the non-json body in the error message so
  that developers understand what went wrong in the HTTP request and its
  parsing.

### 0.7.0

- `toHex(num)` now throws when `typeof num !== "number"`

### 0.6.0

- Remove `solc` and all related functions (`allFunctions`, `getStorageLocation`
  & `compile`).

### 0.5.3

- Have the `transport` module throw a `RPCError`s upon encountering a status
  `>= 500` from an Ethereum full node.

### 0.5.2

- Add `getTransactionReceipt` function

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

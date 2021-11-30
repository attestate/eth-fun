# Changelog

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
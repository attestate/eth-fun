# API

Table of contents:

- [`options object`](#options-object)
- [`await getBlockByNumber(options, blockNumber, includeTxBodies)`](#await-getblockbynumberoptions-blocknumber-includetxbodies)
- [`await getTransactionReceipt(options, txId)`](/API.md#await-gettransactionreceiptoptions-txid)
- [`toHex(number)`](#tohexnumber)
- [`encodeCallSignature(selector, types, values)`](#encodecallsignatureselector-types-values)
- [`decodeCallOutput(types, output)`](#decodecalloutputtypes-output)
- [`async call(options, from, to, data, blockNumber)`](#async-calloptions-from-to-data-blocknumber)
- [`errors object`](#errors-object)
- [`nodes object`](#nodes-object)
- [`async blockNumber(options)`](#async-blocknumberoptions)
- [`async getStorageAt(options, addr, index, blockNumber)`](#async-getstorageatoptions-addr-index-blocknumber)
- [`getStorageLocation(contract, label)`](#getstoragelocationcontract-label)
- [`allFunctions(compiledCode)`](#allfunctionscompiledcode)
- [`async getLogs(options, {fromBlock, toBlock, address, topics, limit })`](#async-getlogsoptions-fromblock-toblock-address-topics-limit-)

### `options object`

`options` are passed to any JSON-RPC call. They may contain the following
properties:

| name    | required? | default                                |
| ------- | --------- | -------------------------------------- |
| url     | yes       | `undefined`                            |
| headers | no        | `{"Content-Type": "application/json"}` |
| [signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal) | no        | `undefined` |

### `await getTransactionReceipt(options, txId)`

Returns a transaction's receipt given it's `hash` as a hexadecimal value.

```js
import { getTransactionReceipt } from "eth-fun";

const options = {
  url: "https://cloudflare-eth.com",
};

const txId =
  "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238";

(async () => {
  const receipt = await getTransactionReceipt(options, txId);
  console.log(receipt);
})();
```

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

#### Notes:

- `toHex` throw errors if `typeof num !== "number"`.

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

#### Notes:

- `decodeCallOutput` may throw errors in cases where it cannot parse the user's
  input.

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

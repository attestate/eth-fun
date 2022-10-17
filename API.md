# API

Table of contents:


* [`options object`](#options-object)
* [`web3-eth-abi` functions](#web3-eth-abi-functions)
    * [`decodeParameters`](#decodeparameters)
* [`await getTransactionReceipt(options, txId)`](#await-gettransactionreceiptoptions-txid)
* [`await getBlockByNumber(options, blockNumber, includeTxBodies)`](#await-getblockbynumberoptions-blocknumber-includetxbodies)
* [`fromHex(number)`](#fromhexnumber)
* [`toHex(number)`](#tohexnumber)
* [`async call(options, from, to, data, blockNumber)`](#async-calloptions-from-to-data-blocknumber)
* [`errors object`](#errors-object)
* [`nodes object`](#nodes-object)
* [`async blockNumber(options)`](#async-blocknumberoptions)
* [`async getStorageAt(options, addr, index, blockNumber)`](#async-getstorageatoptions-addr-index-blocknumber)
* [`async getLogs(options, {fromBlock, toBlock, address, topics, limit })`](#async-getlogsoptions-fromblock-toblock-address-topics-limit-)
* [Weiroll functions](#weiroll-functions)
    * [`command(sel, f, inp, out, target)`](#commandsel-f-inp-out-target)
    * [`CALLTYPES`](#calltypes)
    * [`concatio(inputs)`](#concatioinputs)
    * [`flags(tup, ext, calltype)`](#flagstup-ext-calltype)
    * [`testLength(value, lengthBytes)`](#testlengthvalue-lengthbytes)
    * [`io(isVariable, idx)`](#ioisvariable-idx)


### `options object`

`options` are passed to any JSON-RPC call. They may contain the following
properties:

| name                                                                              | required? | default                                |
| --------------------------------------------------------------------------------- | --------- | -------------------------------------- |
| url                                                                               | yes       | `undefined`                            |
| headers                                                                           | no        | `{"Content-Type": "application/json"}` |
| [signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal) | no        | `undefined`                            |

### `web3-eth-abi` functions

The functions `encodeFunctionSignature`, `encodeEventSignature`,
`encodeParameters`, `encodeFunctionCall`, `decodeParameters`, `decodeLog` are
directly imported and exported from
[`web3-eth-abi@1.4.0`](https://web3js.readthedocs.io/en/v1.4.0/web3-eth-abi.html).
For information on their usage and implementations, refer to the docs of web3.

#### `decodeParameters`

A speciality is that `decodeParameters` returns an iterable list insteads of a `Results` object.

```js
import { decodeParameters } from "eth-fun";
const types = ["uint256"];
const output =
  "0x00000000000000000000000000000000000000000000000041eb63d55b1b0000";
const [returnVal] = decodeParameters(types, output);
console.log(returnVal);
// 4750000000000000000
```

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

### `fromHex(number)`

`eth-fun` doesn't implement a specific `fromHex(number)` function, but you can
use `BigInt(number)` that achieves the same results. Hexadecimal `number` should
start with `0x`.

```js
const hexNum = "0xdeadbeef2deadbabe2deadc0de";
const dec = BigInt(hexNum);
// 17642423810264118620377135825118n
```

#### Notes:

- `BigInt` is preferred instead of `parseInt` because the hexadecimal string
can be bigger than `Number.MAX_SAFE_INTEGER`.

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

### `async call(options, from, to, data, blockNumber)`

Executes an Ethereum message call directy and without creating a
transaction. For information to how to encode `data`, see function
description of `encodeFunctionCall`. And for description on how to
decode an eth call's output, see `decodeParameters`.

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


### Weiroll functions

The following functions are helpers to build Weiroll commands.

#### `command(sel, f, inp, out, target)`

Constructs a Weiroll command to be sent to a Weiroll VM for execution.

```js

import {
  concatio,
  io,
  command,
  testLength,
  flags,
  CALLTYPES,
  encodeFunctionCall,
} from "eth-fun";


const sel = Buffer.from("313ce567", "hex"); // === keccak256("decimals()");
const f = Buffer.from("02", "hex");
const full = Buffer.from("ff", "hex");
const inp = Buffer.concat([full, full, full, full, full, full]);
const out = io(false, 0);
const target = Buffer.from("C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "hex"); //WETH
const cmd = command(sel, f, inp, out, target);

// This address should be modified point to an actual Weiroll VM instance:
const portalAddr = "0x0";

const options = {
  url: "https://cloudflare-eth.com",
};
const to = portalAddr;
const from = "0x0000000000000000000000000000000000000000";
const data = encodeFunctionCall(
{
  name: "execute",
  type: "function",
  inputs: [
    {
      type: "bytes32[]",
      name: "commands",
    },
    {
      type: "bytes[]",
      name: "state",
    },
  ],
},
// NOTE: Weiroll state array needs to be of same length as input + output.
[[`0x${cmd.toString("hex")}`], ["0x0"]]
);

// const output = await call(options, from, to, data);
```


#### `CALLTYPES`

Structure exposing the supported Weiroll call types.

#### `concatio(inputs)`

Concatenates Weiroll input buffers.

#### `flags(tup, ext, calltype)`

Returns a 1-byte flag argument for a Weiroll command.

See: https://github.com/weiroll/weiroll#flags

#### `testLength(value, lengthBytes)`

Checks that the value has the correct length in bytes.

#### `io(isVariable, idx)`

Returns a 1-byte Weiroll argument specifier.

See: https://github.com/weiroll/weiroll#inputoutput-list-ino-format

#### Notes

Refer to the [Weiroll documentation](https://github.com/weiroll/weiroll) for
more details.

See `test/weirollCall_test.js` for examples.

Weiroll VM instances can be selfdestructed by any caller, as they make usage of
delegatecall. For that reason, no public instance is available. You'll probably
want to deploy your own instance.

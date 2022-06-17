# eth-fun

[![Node.js CI](https://github.com/rugpullindex/eth-fns/actions/workflows/node.js.yml/badge.svg)](https://github.com/rugpullindex/eth-fns/actions/workflows/node.js.yml)

<p align="center">
  <img src="/assets/eth-fun-logo-light.svg#gh-light-mode-only" />
  <img src="/assets/eth-fun-logo-dark.svg#gh-dark-mode-only" />
</p>

### A collection of independent utility functions for Ethereum. Build with functional approach in mind.

#### [API Documentation](/API.md) | [Changelog](/CHANGELOG.md) | [Contributing](readme.md/#Contributing)

## Why Use eth-fun?

You should use eth-fun when you want to have _fun_. We try to build our
code according to the properties below.

- **Functional** in nature
- **Modular** and as **loosely** coupled as possible.
- **Stateless**; such that we come as close as possible towards atomic,
  safely-failable (and catchable) actions.
- Built with a modern front end's needs in mind. Ideally, the whole lib is
  **tree-shakeable** and produces the **smallest footprint** possible when being sent
  to a client's browser.

eth-fun is an attempt at developing Ethereum in a one-way-dataflow fashion
(similar to react.js). eth-fun is a **work-in-progress**.

## Installation

```bash
$ npm i eth-fun
```

## Example

#### Get the latest block number and fetch information about it

```js
import { blockNumber, getBlockByNumber } from "eth-fun";

// URL of an Ethereum node
const options = {
  url: "https://cloudflare-eth.com",
};

(async () => {
  const currentNumber = await blockNumber(options); // latest block
  const includeTxBodies = false;
  const block = await getBlockByNumber(options, currentNumber, includeTxBodies);
  console.log(block); // information about the block
})();
```

Similar to the above used functions i.e. `blockNumber` and `getBlockByNumber`
eth-fun implements more utility functions to talk with an Ethereum node using
[JSON RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/).

## API

Visit [API documentation](/API.md) for a complete list of functions and their examples.

- [`options object`](/API.md#options-object)
- [`await getBlockByNumber(options, blockNumber, includeTxBodies)`](/API.md#await-getblockbynumberoptions-blocknumber-includetxbodies)
- [`await getTransactionReceipt(options, txId)`](/API.md#await-gettransactionreceiptoptions-txid)
- [`toHex(number)`](/API.md#tohexnumber)
- [`encodeCallSignature(selector, types, values)`](/API.md#encodecallsignatureselector-types-values)
- [`decodeCallOutput(types, output)`](/API.md#decodecalloutputtypes-output)
- [`async call(options, from, to, data, blockNumber)`](/API.md#async-calloptions-from-to-data-blocknumber)
- [`errors object`](/API.md#errors-object)
- [`nodes object`](/API.md#nodes-object)
- [`async blockNumber(options)`](/API.md#async-blocknumberoptions)
- [`async getStorageAt(options, addr, index, blockNumber)`](/API.md#async-getstorageatoptions-addr-index-blocknumber)
- [`compile(code, [options])`](/API.md#compilecode-options)
- [`getStorageLocation(contract, label)`](/API.md#getstoragelocationcontract-label)
- [`allFunctions(compiledCode)`](/API.md#allfunctionscompiledcode)
- [`async getLogs(options, {fromBlock, toBlock, address, topics, limit })`](/API.md#async-getlogsoptions-fromblock-toblock-address-topics-limit-)

## Examples

- [limit-requests](/examples/limit-requests) - An example to demonstrate concurrency so that the RPC endpoint doesn't get choked

## Changelog

Visit [CHANGELOG.md](/CHANGELOG.md)

## Contributing

We love contributions from the community. Find a [good first issue](https://github.com/rugpullindex/eth-fun/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

Want to suggest a feature or even better raise a PR for it? Head over to the [issues](https://github.com/rugpullindex/eth-fun/issues) section or join our [discord](https://discord.gg/zhawZxgKQz).

You can also get paid for a PR. For more information read our [handbook](https://github.com/rugpullindex/documents/blob/master/handbook.md).

## References

- [Ethereum JSON-RPC Specification](https://ethereum.github.io/execution-apis/api-documentation/)

## License

See LICENSE file.

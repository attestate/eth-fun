### Example to limit requests

This is a working example to limit the concurrency of requests.

#### Motivation

Using eth-fun without any concurrency can choke the RPC endpoint.

#### Overview

This example uses the [p-limit library](https://github.com/sindresorhus/p-limit) to limit concurrency.

```js
const pool = pLimit(concurrency);
const promises = [];

for (let i = 0; i < totalRequests; i++) {
  promises.push(pool(() => blockNumber(options)));
}
```

Wrapping eth-fun functions in `pool` ensures at most _n_ number of calls are made. You can see the difference in elapsed time as you change the concurrency.

#### Usage

```sh
$ npm install
```

```sh
$ npm run start
```

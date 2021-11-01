const startTime = process.hrtime();

import { blockNumber } from "eth-fun";
import pLimit from "p-limit";

const concurrency = 10; // Max requests to be sent at a time
const totalRequests = 100;
const options = {
  url: "https://cloudflare-eth.com",
};

const pool = pLimit(concurrency);
const promises = [];

for (let i = 0; i < totalRequests; i++) {
  promises.push(pool(() => blockNumber(options)));
}

const results = await Promise.allSettled(promises);
const countFullfiled = results.filter(
  (result) => result.status === "fulfilled"
).length;

console.log(
  `Successfully executed ${countFullfiled} requests out of ${results.length} with concurrency of ${concurrency}.`
);

const diff = process.hrtime(startTime);
console.log(`Execution time: ${diff[0]}s ${diff[1] / 1000000}ms`);

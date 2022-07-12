const test = require("ava");
const ethFun = require("../cjs/index");

test("Import CommonJS build", (t) => {
  const fns = Object.keys(ethFun);
  t.true(fns.includes("blockNumber"));
  t.true(fns.includes("call"));
  t.true(fns.includes("decodeParameters"));
  t.true(fns.includes("encodeFunctionCall"));
  t.true(fns.includes("encodeFunctionSignature"));
  t.true(fns.includes("encodeParameters"));
  t.true(fns.includes("errors"));
  t.true(fns.includes("getBlockByNumber"));
  t.true(fns.includes("getLogs"));
  t.true(fns.includes("getStorageAt"));
  t.true(fns.includes("getTransactionReceipt"));
  t.true(fns.includes("nodes"));
  t.true(fns.includes("toHex"));
});

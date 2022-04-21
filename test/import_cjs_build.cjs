const test = require("ava");
const ethFun = require("../cjs/index");

test("Import CommonJS build", (t) => {
  t.deepEqual(
    Object.keys(ethFun),
    [
      "blockNumber",
      "getStorageAt",
      "nodes",
      "errors",
      "call",
      "encodeCallSignature",
      "decodeCallOutput",
      "toHex",
      "getBlockByNumber",
      "getTransactionReceipt",
      "getLogs",
    ].sort()
  );

  Object.keys(ethFun).forEach((func) => {
    t.truthy(func);
  });
});

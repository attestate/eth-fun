const test = require("ava");
const ethFun = require("../cjs/index");

test("Import CommonJS build", (t) => {
  t.deepEqual(
    Object.keys(ethFun),
    [
      "allFunctions",
      "compile",
      "blockNumber",
      "getStorageAt",
      "getStorageLocation",
      "nodes",
      "errors",
      "call",
      "encodeCallSignature",
      "decodeCallOutput",
      "toHex",
      "getBlockByNumber",
      "getLogs",
    ].sort()
  );

  Object.keys(ethFun).forEach((func) => {
    t.truthy(func);
  });
});

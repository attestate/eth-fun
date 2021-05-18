// @format

import solc from "solc";

export default function allFunctions(code) {
  let options = {
    language: "Solidity",
    sources: {
      contract: {
        content: code
      }
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"]
        }
      }
    }
  };
  options = JSON.stringify(options);

  let out = solc.compile(options);
  out = JSON.parse(out);

  if (out && out.errors) {
    const severe = out.errors.filter(({ severity }) => severity === "error");
    if (severe.length > 0) {
      console.error(severe);
      throw new Error(`Compiling the code lead to (multiple) severe errors`);
    }
  }

  let fns = [];
  for (let [key, definitions] of Object.entries(out.contracts)) {
    for (let [key, impl] of Object.entries(definitions)) {
      fns = [...fns, ...impl.abi.filter(({ type }) => type === "function")];
    }
  }

  return fns;
}

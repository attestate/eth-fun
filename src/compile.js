// @format
import solc from "solc";

export default function compile(code, options = {}) {
  let input = {
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
    },
    ...options
  };
  input = JSON.stringify(input);

  let out = solc.compile(input);
  out = JSON.parse(out);

  if (out && out.errors) {
    const severe = out.errors.filter(({ severity }) => severity === "error");
    if (severe.length > 0) {
      const msgs = severe
        .map(({ formattedMessage }) => formattedMessage)
        .join("\n");
      throw new Error(`Compiling the code lead to (multiple) severe errors:
        ${msgs}
      `);
    }
  }

  out.contracts = out.contracts.contract;
  delete out.sources;

  return out;
}

//@format
import fetch from "cross-fetch";
import { RPCError } from "./errors.js";

export async function send(options, body) {
  let headers = Object.assign({}, { "Content-Type": "application/json" });
  if (options && options.headers) {
    headers = Object.assign(headers, options.headers);
  }

  let url;
  if (!options.url) {
    throw new Error("`url` is a required property of `options`");
  } else {
    url = options.url;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (res.status === 403) {
    const answer = await res.text();
    if (answer.includes("invalid host specified")) {
      throw new RPCError(
        `Status: 403 Forbidden; Ethereum node answered with: "${answer}".`
      );
    } else {
      throw new Error("Unexpected error. Please report on eth-fun repository.");
    }
  }

  if (res.status >= 500) {
    throw new RPCError(`RPC endpoint sent status: "${res.status}"`);
  }

  const result = await res.text();

  let data;
  try {
    data = JSON.parse(result);
  } catch (err) {
    throw new RPCError(
      `Encountered error when trying to parse JSON body result: "${result}", error: "${err.toString()}"`
    );
  }

  return data.result;
}

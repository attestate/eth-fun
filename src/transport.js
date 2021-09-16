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
    body: JSON.stringify(body)
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

  const data = await res.json();

  if (data.error) {
    throw new RPCError(`${data.error.message} Code: ${data.error.code}`);
  }

  return data.result;
}

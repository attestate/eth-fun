//@format
import fetch from "cross-fetch";
import {RPCError} from "./errors.mjs";

export async function send(options, body) {
  let headers = Object.assign({}, { "Content-Type": "application/json"});
  if (options && options.headers) {
    headers = Object.assign(headers, options.headers);
  }

  let url;
  if(!options.url) {
    throw new Error("`url` is a required property of `options`");
  } else {
    url = options.url;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  const data = await res.json();

  if (data.error) {
    throw new RPCError(`${data.error.message} Code: ${data.error.code}`);
  }

  return data.result;
}

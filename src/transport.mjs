//@format
import fetch from "cross-fetch";
import {RPCError} from "./errors.mjs";

export async function send(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();

  if (data.error) {
    throw new RPCError(`${data.error.message} Code: ${data.error.code}`);
  }

  return data.result;
}

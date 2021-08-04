// @format
import test from "ava";
import quibble from "quibble";
import fetchMock from "fetch-mock";

import { send } from "../src/transport.mjs";

test("if extra headers are sent in request", async t => {
  const body = { hello: "world" };

  const options = {
    url: "https://test.com",
    headers: { Authorization: "Bearer bear" }
  };

  fetchMock.post(options, { result: true });
  const sandbox = fetchMock.sandbox();
  await quibble.esm("cross-fetch", undefined, sandbox);
  const mockSend = (await import("../src/transport.mjs")).send;

  t.true(await mockSend(options, body));
  const [_, call] = sandbox.lastCall();
  t.deepEqual(
    call.headers,
    Object.assign({}, options.headers, { "Content-Type": "application/json" })
  );
});

test("if error is thrown when `url` property isn't present in `options`", async t => {
  await t.throwsAsync(async () =>
    send({ "send-not-present": "it's not there" })
  );
});

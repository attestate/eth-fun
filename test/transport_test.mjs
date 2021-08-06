// @format
import test from "ava";
import quibble from "quibble";
import fetchMock from "fetch-mock";

import { send } from "../src/transport.mjs";

test.after.always(t => {
	quibble.reset();
});

test.serial("if extra headers are sent in request", async t => {
  const body = { hello: "world" };

  const options = {
    url: "https://test1.com",
    headers: { Authorization: "Bearer bear" }
  };

  fetchMock.post(options, { body: { result: true }, status: 200 });
  const sandbox = fetchMock.sandbox();
  await quibble.esm("cross-fetch", undefined, sandbox);
  const mockSend = (await import("../src/transport.mjs")).send;

  t.true(await mockSend(options, body));
  const [_, call] = sandbox.lastCall();
  t.deepEqual(
    call.headers,
    Object.assign({}, options.headers, { "Content-Type": "application/json" })
  );
  quibble.reset();
});

test.serial("if RPCError is thrown on a 403 error from the node", async t => {
  const body = { hello: "world" };

  const options = {
    url: "https://test2.com",
    headers: { Authorization: "Bearer bear" },
  };

  fetchMock.post(options, { body: "invalid host specified", status: 403 });
  const sandbox = fetchMock.sandbox();
  await quibble.esm("cross-fetch", undefined, sandbox);
  const mockSend = (await import("../src/transport.mjs")).send;
  const RPCError = (await import("../src/errors.mjs")).RPCError;

  await t.throwsAsync(async () => await mockSend(options, body), {
    instanceOf: RPCError
  });
});

test("if error is thrown when `url` property isn't present in `options`", async t => {
  await t.throwsAsync(async () =>
    send({ "send-not-present": "it's not there" })
  );
});

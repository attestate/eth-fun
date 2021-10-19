// @format
import test from "ava";
import fetchMock from "fetch-mock";
import esmock from "esmock";

import { send } from "../src/transport.js";

test.serial("if extra headers are sent in request", async (t) => {
  const body = { hello: "world" };

  const options = {
    url: "https://test1.com",
    headers: { Authorization: "Bearer bear" },
  };

  fetchMock.post(options, { body: { result: true }, status: 200 });
  const sandbox = fetchMock.sandbox();
  const { send: mockSend } = await esmock("../src/transport.js", null, {
    "cross-fetch": { default: sandbox },
  });

  t.true(await mockSend(options, body));
  const [_, call] = sandbox.lastCall();
  t.deepEqual(
    call.headers,
    Object.assign({}, options.headers, { "Content-Type": "application/json" })
  );
});

test.serial("if RPCError is thrown on a 403 error from the node", async (t) => {
  const body = { hello: "world" };

  const options = {
    url: "https://test2.com",
    headers: { Authorization: "Bearer bear" },
  };

  fetchMock.post(options, { body: "invalid host specified", status: 403 });
  const sandbox = fetchMock.sandbox();
  const { send: mockSend } = await esmock("../src/transport.js", null, {
    "cross-fetch": { default: sandbox },
  });

  await t.throwsAsync(async () => await mockSend(options, body), {
    message:
      'Status: 403 Forbidden; Ethereum node answered with: "invalid host specified".',
  });
});

test("if error is thrown when `url` property isn't present in `options`", async (t) => {
  await t.throwsAsync(async () =>
    send({ "send-not-present": "it's not there" })
  );
});

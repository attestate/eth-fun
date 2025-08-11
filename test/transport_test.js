// @format
import test from "ava";
import fetchMock from "fetch-mock";
import esmock from "esmock";
import AbortController from "abort-controller";

import { send } from "../src/transport.js";
import { RPCError } from "../src/errors.js";

test.serial(
  "if usable error message is logged when body isn't JSON parsable",
  async (t) => {
    const options = {
      url: "https://test4.com",
    };

    fetchMock.post(
      options,
      { body: "<p>some funny json body</p>" },
      { status: 200 }
    );
    const sandbox = fetchMock.sandbox();
    const { send: mockSend } = await esmock("../src/transport.js", null, {
      "cross-fetch": { default: sandbox },
    });

    await t.throwsAsync(async () => await mockSend(options));
  }
);

test.serial("if >= 500 server error throws", async (t) => {
  const options = {
    url: "https://test3.com",
  };

  fetchMock.post(options, { status: 500 });
  const sandbox = fetchMock.sandbox();
  const { send: mockSend } = await esmock("../src/transport.js", null, {
    "cross-fetch": { default: sandbox },
  });

  await t.throwsAsync(async () => await mockSend(options));
});

test.serial("if abort signal is executed", async (t) => {
  const body = { hello: "world" };

  const mockOptions = {
    url: "https://test2309.com",
    headers: { Authorization: "Bearer bear" },
  };

  const delay = 1000;
  fetchMock.post(
    mockOptions,
    { body: { result: true }, status: 200 },
    { delay }
  );
  const sandbox = fetchMock.sandbox();
  const { send: mockSend } = await esmock("../src/transport.js", null, {
    "cross-fetch": { default: sandbox },
  });

  const controller = new AbortController();
  const options = {
    ...mockOptions,
    signal: controller.signal,
  };
  const maxTimeout = 500;
  let timer = setTimeout(() => controller.abort(), maxTimeout);
  try {
    await mockSend(options, body);
  } catch (e) {
    t.true(e instanceof DOMException);
  }
  clearTimeout(timer);
});

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

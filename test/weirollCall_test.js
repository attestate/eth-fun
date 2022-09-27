// @format
import test from "ava";

import {
  concatio,
  io,
  command,
  testLength,
  flags,
  CALLTYPES,
  encodeFunctionCall,
  call,
  decodeParameters,
} from "../src/index.js";

test("produce actual weiroll call for WETH contract", async (t) => {
  const sel = Buffer.from("70a08231", "hex"); // === keccak256("balanceOf(address)");
  const f = Buffer.from("02", "hex");
  const full = Buffer.from("ff", "hex");
  const inp = concatio([io(false, 0), full, full, full, full, full]);
  const out = io(false, 1);
  const target = Buffer.from("C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "hex"); //WETH
  const cmd = command(sel, f, inp, out, target);

  const portalAddr = "0x6bb52BE538A1E5668a9c45626EDF2C590e86CA76";
  // NOTE: Weiroll static state variables length needs to be 32.
  const owner = `0x${"f04a5cc80b1e94c69b48f5ee68a08cd2f09a7c3e".padStart(
    32 * 2,
    "0"
  )}`; //WETH lending pool

  const options = {
    url: "https://cloudflare-eth.com",
  };
  const to = portalAddr;
  // NOTE: We set msg.sender to address(0) as this is what the VM Portal
  // contract expects: `if (msg.sender != caller) revert NotCaller();`
  const from = "0x0000000000000000000000000000000000000000";
  const data = encodeFunctionCall(
    {
      name: "execute",
      type: "function",
      inputs: [
        {
          type: "bytes32[]",
          name: "commands",
        },
        {
          type: "bytes[]",
          name: "state",
        },
      ],
    },
    // NOTE: Weiroll state array needs to be of same length as input + output.
    [[`0x${cmd.toString("hex")}`], [owner, "0x0"]]
  );

  const output = await call(options, from, to, data);
  const returns = decodeParameters(["bytes[]"], output);
  t.assert(BigInt(returns[0][1]) / BigInt(10 ** 18) > 0);
});

test("generating function call to add(uint, uint)", (t) => {
  const sel = Buffer.from("9f313803", "hex"); // === keccak256("add(uint,uint)");

  const f = Buffer.from("00", "hex");

  const full = Buffer.from("ff", "hex");
  const inp = Buffer.concat([
    io(false, 0),
    io(false, 1),
    full,
    full,
    full,
    full,
  ]);

  const out = io(false, 2);

  const target = Buffer.from("0000000000000000000000000000000000000001", "hex");

  const cmd = command(sel, f, inp, out, target);

  const expectedSel = "9f313803";
  const expectedF = "00";
  const expectedInp = "0001ffffffff";
  const expectedOut = "02";
  const expectedTarget = "0000000000000000000000000000000000000001";
  const expected = Buffer.from(
    `${expectedSel}${expectedF}${expectedInp}${expectedOut}${expectedTarget}`,
    "hex"
  );

  t.is(cmd.length, 32);
  t.is(cmd.compare(expected), 0);
});

test("generating function call to concatBytes32(bytes32[])", (t) => {
  const sel = Buffer.from("9e734c6a", "hex"); // === keccak256("concatBytes32(bytes32[])");

  const f = Buffer.from("00", "hex");

  const full = Buffer.from("ff", "hex");
  const inp = Buffer.concat([
    io(true, 0b1000000),
    full,
    full,
    full,
    full,
    full,
  ]);

  const out = io(true, 1);

  const target = Buffer.from("0000000000000000000000000000000000000001", "hex");

  const cmd = command(sel, f, inp, out, target);

  const expectedSel = "9e734c6a";
  const expectedF = "00";
  const expectedInp = "c0ffffffffff";
  const expectedOut = "81";
  const expectedTarget = "0000000000000000000000000000000000000001";
  const expected = Buffer.from(
    `${expectedSel}${expectedF}${expectedInp}${expectedOut}${expectedTarget}`,
    "hex"
  );

  t.is(cmd.length, 32);
  t.is(cmd.compare(expected), 0);
});

test("creating a command", (t) => {
  const sel = Buffer.from("00000000", "hex");
  const f = Buffer.from("02", "hex");
  const inp = Buffer.from("000000000000", "hex");
  const out = Buffer.from("00", "hex");
  const target = Buffer.from("005241438caf3eacb05bb6543151f7af894c5b58", "hex");
  const cmd = command(sel, f, inp, out, target);
  t.is(cmd.length, 32);
  const expected = Buffer.from(
    "000000000200000000000000005241438caf3eacb05bb6543151f7af894c5b58",
    "hex"
  );
  t.is(expected.length, 32);
  t.is(cmd.compare(expected), 0);
});

test("length of number", (t) => {
  testLength(0b00, 1);
  testLength(0b00000000, 1);
  testLength(0b11111111, 1);
  t.throws(() => testLength(0b111111111, 1));
});

test("calculating io with variability", (t) => {
  const variability = true;
  const idx = 0b0;
  const ioBit = io(variability, idx);
  const expected = Buffer.from("80", "hex");
  t.is(ioBit.compare(expected), 0);
});

test("calculating io", (t) => {
  const variability = false;
  const idx = 0b1;
  const ioBit = io(variability, idx);
  const expected = Buffer.from("01", "hex");
  t.is(ioBit.compare(expected), 0);
});

test("concatting io", (t) => {
  const variability = false;
  const idx = 0b1;
  const ioBit = io(variability, idx);
  const full = Buffer.from("ff", "hex");
  const ioBuf = concatio([ioBit, full, full, full, full, full]);
  const expected = Buffer.from("01ffffffffff", "hex");
  t.is(ioBuf.compare(expected), 0);
});

test("if concatting io buf throws upon false buffer length", (t) => {
  const variability = false;
  const idx = 0b1;
  const ioBit = io(variability, idx);
  const full = Buffer.from("ff", "hex");
  t.throws(() => concatio([ioBit]));
});

test("calculating flags", (t) => {
  const tup = 0b0;
  const ext = 0b0;
  const calltype = CALLTYPES.STATICCALL;
  const flag = flags(tup, ext, calltype);
  const expected = Buffer.from("02", "hex");
  t.is(flag.compare(expected), 0);
});

test("if flags throws upon passing too large arguments", (t) => {
  const tup = 0b11111111;
  const ext = 0b0;
  const calltype = CALLTYPES.STATICCALL;
  t.throws(() => flags(tup, ext, calltype));
});

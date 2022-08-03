//@format

// Specification: https://github.com/weiroll/weiroll#command-structure
export const CALLTYPES = {
  STATICCALL: 0b10,
};

export function testLength(value, lengthBytes) {
  const maxint = Math.pow(2, 8 * lengthBytes);
  if (value >= maxint) {
    throw new Error(
      `Cannot take input that produces an output > uint${
        8 * lengthBytes
      }.MAX_INT. Actual value: ${value}`
    );
  }
}

export function command(sel, f, inp, out, target) {
  const lengthBytes = 32;
  const buf = Buffer.concat([sel, f, inp, out, target]);
  if (buf.length !== lengthBytes) {
    throw new Error(
      `Cannot take input that produces an output of more or less than ${lengthBytes} bytes of length. Actual length: ${buf.length}`
    );
  }

  return buf;
}

// See: https://github.com/weiroll/weiroll#flags
export function flags(tup, ext, calltype) {
  const reserved = 0b0000;
  const flag = tup + ext + reserved + calltype;
  const lengthBytes = 1;
  testLength(flag, lengthBytes);
  const buf = Buffer.alloc(lengthBytes);
  buf.writeUInt8(flag);
  return buf;
}

// See: https://github.com/weiroll/weiroll#inputoutput-list-ino-format
export function io(isVariable, idx /* may be any ES number < 2^7 */) {
  if (typeof isVariable !== "boolean") {
    throw new Error(
      `isVariable must be a boolean. Actual Value: ${isVariable}`
    );
  }

  const variability = isVariable ? 0b10000000 : 0b0;
  const result = variability + idx;
  const maxint = Math.pow(2, 8);
  const lengthBytes = 1;
  testLength(result, lengthBytes);
  const buf = Buffer.alloc(lengthBytes);
  buf.writeUInt8(result);
  return buf;
}

export function concatio(inputs) {
  const lengthBytes = 6;
  const buf = Buffer.concat(inputs);
  if (buf.length !== lengthBytes) {
    throw new Error(
      `Cannot take input that produces an output of more or less than ${lengthBytes} bytes of length. Actual length: ${buf.length}`
    );
  }
  return buf;
}

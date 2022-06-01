// @format
export class RPCError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RPCError);
    }

    this.name = "RPCError";
  }
}

export class ValueError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValueError);
    }

    this.name = "ValueError";
  }
}

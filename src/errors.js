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

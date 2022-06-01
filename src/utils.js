// @format
import { ValueError } from "./errors.js";

export function toHex(num) {
  if (typeof num !== "number")
    throw new ValueError(
      `toHex expects typeof "number", input type: "${typeof num}"`
    );
  return `0x${num.toString(16)}`;
}

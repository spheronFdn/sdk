export * from "./crypto";
export * from "./encryption";
export * from "./interface";
export * from "./types";
export * from "./utils";

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  globalThis.crypto = require("crypto").webcrypto;
} catch (e) {
  /* empty */
}

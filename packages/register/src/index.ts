import { resetWriter } from "@lbu/insight";

tryRequire("dotenv/config");
// process.env.NODE_ENV may have changed which influences the logging
resetWriter();

if ((process.env.NODE_ENV || "").toLowerCase().trim() === "development") {
  tryRequire("ts-node/register");
}

function tryRequire(pkg: string): void {
  try {
    require(pkg);
  } catch (e) {
    return undefined;
  }
}

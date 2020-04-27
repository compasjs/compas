import { newLogger } from "@lbu/insight";
import {
  filenameForModule,
  mainFn,
  processDirectoryRecursiveSync,
} from "@lbu/stdlib";
import test from "tape";

const __filename = filenameForModule(import.meta);

const contentHandler = async (file) => {
  // Skip this index file
  if (file === __filename) {
    return;
  }
  if (!file.endsWith(".test.js")) {
    return;
  }
  await import(file);
};

mainFn(
  import.meta,
  newLogger({
    ctx: {
      type: "test",
    },
  }),
  main,
);

async function main() {
  test.Test.prototype.asyncShouldThrow = async function (cb, msg) {
    try {
      await cb();
      this.fail(msg);
    } catch (e) {
      this.ok(msg || e.message);
    }
  };

  test.Test.prototype.asyncShouldNotThrow = async function (cb) {
    try {
      await cb();
      this.ok(true, "cb did not throw");
    } catch (e) {
      this.fail(e);
    }
  };

  await processDirectoryRecursiveSync(process.cwd(), contentHandler);
}

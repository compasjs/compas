import { newLogger } from "@lbu/insight";
import {
  filenameForModule,
  mainFn,
  processDirectoryRecursiveSync,
} from "@lbu/stdlib";
import tape from "tape";
import promiseWrap from "tape-promise";

const test = promiseWrap.default(tape);
const __filename = filenameForModule(import.meta);

const contentHandler = async file => {
  // Skip this index file
  if (file === __filename) {
    return;
  }
  if (!file.endsWith(".test.js")) {
    return;
  }

  const fileData = await import(file);
  await test(
    file,
    {
      skip: fileData.skip || false,
      todo: fileData.todo || false,
      timeout: fileData.timeout || 500,
    },
    fileData.test,
  );
};

mainFn(
  import.meta,
  newLogger({
    ctx: {
      type: "TEST",
    },
  }),
  () => processDirectoryRecursiveSync(process.cwd(), contentHandler),
);

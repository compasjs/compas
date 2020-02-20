const tape = require("tape");
const promiseWrap = require("tape-promise");
const test = promiseWrap.default(tape);

const { processDirectoryRecursiveSync } = require("@lbu/stdlib");
const { mainFn } = require("@lbu/cli");
const { newLogger } = require("@lbu/insight");

const contentHandler = file => {
  // Skip this index file
  if (file === __filename) {
    return;
  }
  if (!file.endsWith(".test.js")) {
    return;
  }

  const fileData = require(file);
  test(
    file,
    {
      skip: fileData.skip || false,
      todo: fileData.todo || false,
      timeout: fileData.timeout || 500,
    },
    fileData,
  );
};

mainFn(
  module,
  require,
  newLogger({
    ctx: {
      type: "TEST",
    },
  }),
  () => {
    processDirectoryRecursiveSync(process.cwd(), contentHandler);
  },
);

const tape = require("tape");
const promiseWrap = require("tape-promise");
const test = promiseWrap.default(tape);

const fs = require("fs");
const path = require("path");
const { mainFn } = require("@lbu/cli");
const { newLogger } = require("@lbu/insight");

const recursiveDirExec = (dir, cb) => {
  for (const file of fs.readdirSync(dir, { encoding: "utf-8" })) {
    if (file === "node_modules" || file.startsWith(".")) {
      continue;
    }

    const newPath = path.join(dir, file);

    if (fs.lstatSync(newPath).isDirectory()) {
      recursiveDirExec(newPath, cb);
    } else if (newPath.endsWith(".test.js")) {
      cb(newPath);
    }
  }
};

const contentHandler = file => {
  // Skip this index file
  if (file === __filename) {
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
    recursiveDirExec(process.cwd(), contentHandler);
  },
);

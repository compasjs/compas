const {
  bytesToHumanReadable,
  printProcessMemoryUsage,
} = require("./src/memory");
const { newLogger } = require("./src/logger");

const log = newLogger({
  depth: 4,
});

module.exports = {
  log,
  newLogger,
  bytesToHumanReadable,
  printProcessMemoryUsage,
};

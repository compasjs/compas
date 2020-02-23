const { mainFn, spawn } = require("@lbu/stdlib");
const { newLogger } = require("@lbu/insight");
const { isNil } = require("@lbu/stdlib");
const { join } = require("path");
const { readdirSync } = require("fs");

const main = async logger => {
  const [workingDir] = process.argv.slice(2);

  if (isNil(workingDir)) {
    logger.error("Please specify the working directory to link to");
    process.exit(1);
  }

  const packagesDir = join(process.cwd(), "packages");
  const packages = readdirSync(packagesDir);

  for (const pkg of packages) {
    await spawn("yarn", ["link", `@lbu/${pkg}`], {
      cwd: join(process.cwd(), workingDir),
    });
  }
};

mainFn(module, require, newLogger(), main);

module.exports = {
  disallowNodemon: true,
};

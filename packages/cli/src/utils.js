const { existsSync, readdirSync } = require("fs");
const { join } = require("path");

const getKnownScripts = () => {
  const result = {};

  const userDir = join(process.cwd(), "scripts");
  if (existsSync(userDir)) {
    for (const item of readdirSync(userDir)) {
      const name = item.split(".")[0];

      result[name] = {
        type: "USER",
        path: join(userDir, item),
      };
    }
  }

  const pkgJson = require(join(process.cwd(), "package.json"));
  for (const item of Object.keys(pkgJson.scripts || {})) {
    result[item] = { type: "YARN", script: pkgJson.scripts[item] };
  }

  const cliDir = join(__dirname, "../scripts");
  for (const item of readdirSync(cliDir)) {
    const name = item.split(".")[0];

    result[name] = {
      type: "CLI",
      path: join(cliDir, item),
    };
  }

  return result;
};

/**
 * @callback MainFnCallback
 * @param {Logger} logger
 * @returns {Promise.<void>|void}
 */

/**
 * Run the provided cb if this file is the process entrypoint
 * @param {NodeJS.Module} module
 * @param {NodeJS.Require} require
 * @param {Logger} logger
 * @param {MainFnCallback} cb
 */
const mainFn = (module, require, logger, cb) => {
  if (module === require.main) {
    let result = cb(logger);
    Promise.resolve(result).catch(e => logger.error(e));
  }
};

module.exports = {
  getKnownScripts,
  mainFn,
};

const { logger } = require("../src/logger");
const { getKnownScripts, mainFn } = require("../src/utils");

const { name, version } = require("../package");

const formatCommands = () => {
  const scripts = getKnownScripts();
  let result = {
    USER: [],
    CLI: [],
    YARN: [],
  };

  for (const key of Object.keys(scripts)) {
    result[scripts[key].type].push(key);
  }

  return `LBU internal: ${result["CLI"].join(", ")}
User: ${result["USER"].join(", ")}
Package.json: ${result["YARN"].join(", ")}`;
};

mainFn(module, require, logger, logger => {
  logger.info(
    `${name} -- ${version}\nUsage: lbu [command] [...args]\n\nAvailable commands:\n${formatCommands()}`,
  );
});

module.exports = {
  disallowNodemon: true,
};

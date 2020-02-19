const { exec: cpExec, spawn: cpSpawn } = require("child_process");
const { promisify } = require("util");

const internalExec = promisify(cpExec);

/**
 * Promisify version of child_process#exec
 * @callback Exec
 * @param {string} command
 * @returns {Promise<Object<{stdout: string, stderr: string}>>}
 */
const exec = command => internalExec(command, { encoding: "utf8" });

/**
 * A promise wrapper around child_process#spawn
 * @param {string} command
 * @param {string[]} args
 * @param {Object} [opts={}]
 * @returns {Promise<void>}
 */
const spawn = (command, args, opts = {}) => {
  return new Promise((resolve, reject) => {
    const sp = cpSpawn(command, args, { stdio: "inherit", ...opts });

    sp.once("error", reject);
    sp.once("exit", resolve);
  });
};

module.exports = {
  spawn,
  exec,
};

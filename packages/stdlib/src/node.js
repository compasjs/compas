const { exec: cpExec, spawn: cpSpawn } = require("child_process");
const {
  lstatSync,
  readdirSync,
  promises: { lstat, readdir },
} = require("fs");
const { join } = require("path");
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

/**
 * Recursively walks directory async and calls cb on all files.
 * By default skips node_modules and files starting with a dot
 * @param {string} dir
 * @param {Function} cb
 * @param {Object} [opts={}]
 * @param {boolean} [opts.skipNodeModules=true]
 * @param {boolean} [opts.skipDotFiles=true]
 */
const processDirectoryRecursive = async (
  dir,
  cb,
  opts = {
    skipDotFiles: true,
    skipNodeModules: true,
  },
) => {
  for (const file of await readdir(dir, { encoding: "utf8" })) {
    if (opts.skipNodeModules && file === "node_modules") {
      continue;
    }
    if (opts.skipDotFiles && file[0] === ".") {
      continue;
    }

    const newPath = join(dir, file);
    const stat = await lstat(newPath);
    if (stat.isDirectory()) {
      await processDirectoryRecursive(newPath, cb, opts);
    } else if (stat.isFile()) {
      await Promise.resolve(cb(newPath));
    }
  }
};

/**
 *
 * @param {string} dir
 * @param {Function} cb
 * @param {Object} [opts={}]
 * @param {boolean} [opts.skipNodeModules=true]
 * @param {boolean} [opts.skipDotFiles=true]
 */
const processDirectoryRecursiveSync = (
  dir,
  cb,
  opts = {
    skipDotFiles: true,
    skipNodeModules: true,
  },
) => {
  for (const file of readdirSync(dir, { encoding: "utf8" })) {
    if (opts.skipNodeModules && file === "node_modules") {
      continue;
    }
    if (opts.skipDotFiles && file[0] === ".") {
      continue;
    }

    const newPath = join(dir, file);
    const stat = lstatSync(newPath);
    if (stat.isDirectory()) {
      processDirectoryRecursiveSync(newPath, cb, opts);
    } else if (stat.isFile()) {
      cb(newPath);
    }
  }
};

module.exports = {
  processDirectoryRecursive,
  processDirectoryRecursiveSync,
  spawn,
  exec,
};

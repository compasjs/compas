import { exec as cpExec, spawn as cpSpawn } from "child_process";
import { lstatSync, promises, readdirSync } from "fs";
import { join } from "path";
import { promisify } from "util";

const { lstat, readdir } = promises;
const internalExec = promisify(cpExec);

/**
 * Promisify version of child_process#exec
 * @callback Exec
 * @param {string} command
 * @returns {Promise<Object<{stdout: string, stderr: string}>>}
 */
export function exec(command) {
  return internalExec(command, { encoding: "utf8" });
}

/**
 * A promise wrapper around child_process#spawn
 * @param {string} command
 * @param {string[]} args
 * @param {Object} [opts={}]
 * @returns {Promise<void>}
 */
export function spawn(command, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const sp = cpSpawn(command, args, { stdio: "inherit", ...opts });

    sp.once("error", reject);
    sp.once("exit", resolve);
  });
}

/**
 * @typedef {object} ProcessDirectoryOptions
 * @property {boolean} [skipNodeModules] Skip node_modules directory, true by default
 * @property {boolean} [skipDotFiles] Skip files and directories starting with a '.', true
 *    by default
 */

/**
 * Recursively walks directory async and calls cb on all files.
 * By default skips node_modules and files starting with a dot
 * @param {string} dir
 * @param {Function} cb
 * @param {ProcessDirectoryOptions} [opts]
 */
export async function processDirectoryRecursive(
  dir,
  cb,
  opts = {
    skipDotFiles: true,
    skipNodeModules: true,
  },
) {
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
}

/**
 * Sync version of processDirectoryRecursive
 * @param {string} dir
 * @param {Function} cb
 * @param {Object} [opts={}]
 * @param {boolean} [opts.skipNodeModules=true]
 * @param {boolean} [opts.skipDotFiles=true]
 */
export function processDirectoryRecursiveSync(
  dir,
  cb,
  opts = {
    skipDotFiles: true,
    skipNodeModules: true,
  },
) {
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
}

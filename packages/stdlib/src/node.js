import { exec as cpExec, spawn as cpSpawn } from "child_process";
import { lstatSync, readdirSync } from "fs";
import { lstat, readdir } from "fs/promises";
import { join } from "path";
import { promisify } from "util";

const internalExec = promisify(cpExec);

export { join as pathJoin };

/**
 * @callback Exec
 * @param {string} command
 * @param {ExecOptions} [opts={}]
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number}>}
 */
export async function exec(command, opts = {}) {
  try {
    const promise = internalExec(command, { encoding: "utf8", ...opts });
    const { stdout, stderr } = await promise;

    return {
      stdout,
      stderr,
      exitCode: promise.child.exitCode ?? 0,
    };
  } catch (e) {
    return {
      stdout: e.stdout ?? "",
      stderr: e.stderr ?? "",
      exitCode: e.code ?? 1,
    };
  }
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {object} [opts={}]
 * @returns {Promise<{exitCode: number}>}
 */
export function spawn(command, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const sp = cpSpawn(command, args, { stdio: "inherit", ...opts });

    sp.once("error", reject);
    sp.once("exit", (code) => {
      resolve({ exitCode: code ?? 0 });
    });
  });
}

/**
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
 *
 * @param {string} dir
 * @param {Function} cb
 * @param {object} [opts={}]
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

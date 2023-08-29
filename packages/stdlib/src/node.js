import { exec as cpExec, spawn as cpSpawn } from "node:child_process";
import { lstatSync, readdirSync } from "node:fs";
import { lstat, readdir } from "node:fs/promises";
import { posix } from "node:path";
import { promisify } from "node:util";

const internalExec = promisify(cpExec);

/**
 * Join all arguments together and normalize the resulting path. Arguments must be
 * strings. Using Node.js built-in path.posix.join().
 * Which forces use of Posix path separators, '/'.
 *
 * @param {...string} paths
 * @returns {string}
 */
export function pathJoin(...paths) {
  return posix.join(...paths);
}

/**
 * Wrap around Node.js child_process#exec. Resolving when the sub process has exited. The
 * resulting object contains the 'exitCode' of the sub process.
 *
 * @since 0.1.0
 *
 * @param {string} command
 * @param {import("child_process").ExecOptions} [opts={}]
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
  } catch (/** @type {any} */ e) {
    return {
      stdout: e.stdout ?? "",
      stderr: e.stderr ?? "",
      exitCode: e.code ?? 1,
    };
  }
}

/**
 * Wrap around Node.js child_process#spawn. Resolving when the sub process has exited. The
 * resulting object contains the 'exitCode' of the sub process.
 * By default 'stdio' is inherited from the current process.
 *
 * @since 0.1.0
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import("child_process").SpawnOptions} [opts={}]
 * @returns {Promise<{exitCode: number}>}
 */
export function spawn(command, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const sp = cpSpawn(command, args, { stdio: "inherit", ...opts });

    const exitHandler = (signal) => {
      sp.kill(signal);
    };

    process.once("exit", exitHandler);

    sp.once("error", (...args) => {
      process.removeListener("exit", exitHandler);

      // eslint-disable-next-line prefer-promise-reject-errors
      return reject(...args);
    });

    sp.once("exit", (code) => {
      process.removeListener("exit", exitHandler);

      resolve({ exitCode: code ?? 0 });
    });
  });
}

/**
 * Read a readable stream completely, and return as Buffer
 *
 * @since 0.1.0
 *
 * @param {NodeJS.ReadableStream} stream
 * @returns {Promise<Buffer>}
 */
export async function streamToBuffer(stream) {
  // @ts-ignore
  if (!stream || typeof stream._read !== "function") {
    return Buffer.from([]);
  }

  return await new Promise((resolve, reject) => {
    const buffers = [];

    stream.on("data", function (chunk) {
      buffers.push(chunk);
    });
    stream.on("end", function () {
      resolve(Buffer.concat(buffers));
    });
    stream.on("error", function (err) {
      reject(err);
    });
  });
}

/**
 * Recursively act on all files in a directory, awaiting on callback calls.
 *
 * @since 0.1.0
 *
 * @param {string} dir
 * @param {(file: string) => (void|Promise<void>)} cb
 * @param {import("../types/advanced-types.js").ProcessDirectoryOptions} [opts]
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

    const newPath = pathJoin(dir, file);
    const stat = await lstat(newPath);
    if (stat.isDirectory()) {
      await processDirectoryRecursive(newPath, cb, opts);
    } else if (stat.isFile()) {
      await cb(newPath);
    }
  }
}

/**
 * Sync version of processDirectoryRecursive
 *
 * @since 0.1.0
 *
 * @param {string} dir
 * @param {(file: string) => (void)} cb
 * @param {import("../types/advanced-types.js").ProcessDirectoryOptions} [opts]
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

    const newPath = pathJoin(dir, file);
    const stat = lstatSync(newPath);
    if (stat.isDirectory()) {
      processDirectoryRecursiveSync(newPath, cb, opts);
    } else if (stat.isFile()) {
      cb(newPath);
    }
  }
}

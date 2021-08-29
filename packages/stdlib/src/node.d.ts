/// <reference types="node" />
/**
 * @typedef {import("child_process").ExecOptions} ExecOptions
 */
/**
 * @typedef {import("../types/advanced-types")
 *   .ProcessDirectoryOptions
 * } ProcessDirectoryOptions
 */
/**
 * Join all arguments together and normalize the resulting path. Arguments must be
 * strings. Using Node.js built-in path.posix.join().
 * Which forces use of Posix path separators, '/'.
 *
 * @param {...string} paths
 * @returns {string}
 */
export function pathJoin(...paths: string[]): string;
/**
 * Wrap around Node.js child_process#exec. Resolving when the sub process has exited. The
 * resulting object contains the 'exitCode' of the sub process.
 *
 * @since 0.1.0
 *
 * @param {string} command
 * @param {ExecOptions} [opts={}]
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number}>}
 */
export function exec(command: string, opts?: import("child_process").ExecOptions | undefined): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
}>;
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
export function spawn(command: string, args: string[], opts?: import("child_process").SpawnOptions | undefined): Promise<{
    exitCode: number;
}>;
/**
 * Read a readable stream completely, and return as Buffer
 *
 * @since 0.1.0
 *
 * @param {NodeJS.ReadableStream} stream
 * @returns {Promise<Buffer>}
 */
export function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer>;
/**
 * Recursively act on all files in a directory, awaiting on callback calls.
 *
 * @since 0.1.0
 *
 * @param {string} dir
 * @param {(file: string) => (void|Promise<void>)} cb
 * @param {ProcessDirectoryOptions} [opts]
 */
export function processDirectoryRecursive(dir: string, cb: (file: string) => (void | Promise<void>), opts?: import("../types/advanced-types").ProcessDirectoryOptions | undefined): Promise<void>;
/**
 * Sync version of processDirectoryRecursive
 *
 * @since 0.1.0
 *
 * @param {string} dir
 * @param {(file: string) => (void)} cb
 * @param {ProcessDirectoryOptions} [opts]
 */
export function processDirectoryRecursiveSync(dir: string, cb: (file: string) => (void), opts?: import("../types/advanced-types").ProcessDirectoryOptions | undefined): void;
export type ExecOptions = import("child_process").ExecOptions;
export type ProcessDirectoryOptions = import("../types/advanced-types").ProcessDirectoryOptions;
//# sourceMappingURL=node.d.ts.map
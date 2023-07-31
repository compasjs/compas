import { cpus } from "node:os";

export const PARALLEL_COUNT = Math.max(cpus().length - 1, 1);

/**
 * @type {Record<string, {
 *    description: string,
 *    exec: (logger: Logger) => Promise<void>
 * }>}
 */
export const codeModMap = {};

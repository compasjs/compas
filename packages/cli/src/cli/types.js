/**
 * @typedef {import("@compas/stdlib").AppError} AppError
 */

/**
 * @typedef {object} CliLogger
 * @property {(pretty: string, ndjson: any) => void} info
 * @property {(pretty: string, ndjson: any) => void} error
 */

/**
 * @template {{exitCode?: number }} [T={ exitCode?: number }]
 * @typedef {import("@compas/stdlib").Either<T, AppError>} CliResult
 */

/**
 * @typedef {object} CliCommandExecutorState
 * @property {CliDefinition} cli The known cli definition
 * @property {string[]} command The parsed command, can be used to figure out values of
 *   dynamic commands
 * @property {Record<string, boolean|number|string|string[]|number[]|boolean[]>} flags
 *   The values of parsed flags
 */

/**
 * @typedef {{}} CliDefinition
 */

/**
 * @type {boolean}
 */
export const __types = false;

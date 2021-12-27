/**
 * @template {{exitStatus: "passed"|"failed" }} [T={ exitStatus: "passed"|"failed" }]
 * @typedef {T} CliResult
 */

/**
 * @typedef {object} CliExecutorState
 * @property {import("../generated/common/types").CliCommandDefinition} cli The known cli
 *   definition
 * @property {string[]} command The parsed command, can be used to figure out values of
 *   dynamic commands
 * @property {Record<string, boolean|number|string|string[]|number[]|boolean[]>} flags
 *   The values of parsed flags
 */

/**
 * @type {boolean}
 */
export const __types = false;

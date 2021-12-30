/**
 * @template {{exitStatus: "passed"|"failed"|"keepAlive" }} [T={ exitStatus: "passed"|"failed"|"keepAlive" }]
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
 * @typedef {Exclude<import("../generated/common/types").CliCommandDefinition, "subCommands"> & {
 *   parent?: CliResolved,
 *   subCommands: CliResolved[],
 * }} CliResolved
 */

/**
 * @type {boolean}
 */
export const __types = false;

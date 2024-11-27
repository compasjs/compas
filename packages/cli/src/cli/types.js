/**
 * @template {{exitStatus: "passed"|"failed"|"keepAlive" }} [T={ exitStatus: "passed"|"failed"|"keepAlive" }]
 * @typedef {T} CliResult
 */

/**
 * @typedef {object} CliExecutorState
 * @property {import("../generated/common/types.js").CliCommandDefinition} cli The known cli
 *   definition
 * @property {Array<string>} command The parsed command, can be used to figure out values of
 *   dynamic commands
 * @property {Record<string, boolean | number | string | Array<string> | Array<number> | Array<boolean>>} flags
 *   The values of parsed flags
 */

/**
 * @typedef {Exclude<import("../generated/common/types.js").CliCommandDefinition, "subCommands"> & {
 *   parent?: CliResolved,
 *   subCommands: Array<CliResolved>,
 * }} CliResolved
 */

export {};

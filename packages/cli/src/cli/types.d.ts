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
export const __types: boolean;
export type CliResult<
  T extends {
    exitStatus: "passed" | "failed" | "keepAlive";
  } = {
    exitStatus: "passed" | "failed" | "keepAlive";
  },
> = T;
export type CliExecutorState = {
  /**
   * The known cli
   * definition
   */
  cli: import("../generated/common/types").CliCommandDefinition;
  /**
   * The parsed command, can be used to figure out values of
   * dynamic commands
   */
  command: string[];
  /**
   *   The values of parsed flags
   */
  flags: Record<
    string,
    boolean | number | string | string[] | number[] | boolean[]
  >;
};
export type CliResolved = Exclude<
  import("../generated/common/types").CliCommandDefinition,
  "subCommands"
> & {
  parent?: CliResolved;
  subCommands: CliResolved[];
};
//# sourceMappingURL=types.d.ts.map

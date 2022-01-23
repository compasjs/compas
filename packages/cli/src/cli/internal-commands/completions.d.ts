/**
 * Auto completes commands, flags, flag values
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export function cliExecutor(
  logger: import("@compas/stdlib").Logger,
  state: import("../../cli/types.js").CliExecutorState,
): Promise<import("../../cli/types.js").CliResult>;
/**
 * Resolve completions for the cli and input array
 *
 * @param {import("../types").CliResolved} cli
 * @param {string[]} input
 * @returns {Promise<{
 *   commandCompletions: CliCompletion[],
 *   flagCompletions: CliCompletion[],
 * }>}
 */
export function completionsGetCompletions(
  cli: import("../types").CliResolved,
  input: string[],
): Promise<{
  commandCompletions: CliCompletion[];
  flagCompletions: CliCompletion[];
}>;
/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition: import("../../generated/common/types.js").CliCommandDefinitionInput;
//# sourceMappingURL=completions.d.ts.map

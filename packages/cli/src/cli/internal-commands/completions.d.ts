/**
 * From Yargs:
 * - https://github.com/yargs/yargs/blob/30edd5067111b2b59387dcc47f4e7af93b9054f3/LICENSE
 * -
 * https://github.com/yargs/yargs/blob/30edd5067111b2b59387dcc47f4e7af93b9054f3/lib/completion.ts
 * -
 * https://github.com/yargs/yargs/blob/30edd5067111b2b59387dcc47f4e7af93b9054f3/lib/completion-templates.ts
 *
 *
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
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition: import("../../generated/common/types.js").CliCommandDefinitionInput;
//# sourceMappingURL=completions.d.ts.map

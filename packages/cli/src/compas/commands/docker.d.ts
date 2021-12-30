/**
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
 * @typedef {{
 *   containersForContext: {
 *     [p: string]: {
 *       createCommand: string,
 *       pullCommand: [string,string[]]
 *     }
 *   },
 *   globalContainers: string[]
 * } & {
 *   containersOnHost: string[],
 * }} DockerContext
 */
/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition: import("../../generated/common/types.js").CliCommandDefinitionInput;
export type DockerContext = {
  containersForContext: {
    [p: string]: {
      createCommand: string;
      pullCommand: [string, string[]];
    };
  };
  globalContainers: string[];
} & {
  containersOnHost: string[];
};
//# sourceMappingURL=docker.d.ts.map

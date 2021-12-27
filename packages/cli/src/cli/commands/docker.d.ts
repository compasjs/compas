/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../types").CliExecutorState} state
 * @returns {Promise<import("../types").CliResult>}
 */
export function cliExecutor(
  logger: import("@compas/stdlib").Logger,
  state: import("../types").CliExecutorState,
): Promise<import("../types").CliResult>;
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
 * @type {import("../../generated/common/types").CliCommandDefinitionInput}
 */
export const cliDefinition: import("../../generated/common/types").CliCommandDefinitionInput;
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

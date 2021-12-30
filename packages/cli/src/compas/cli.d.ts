#!/usr/bin/env node
/**
 * Get the compas cli with loaded commands
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {{
 *   commandDirectories: {
 *     loadScripts: boolean,
 *     loadProjectConfig: boolean,
 *     loadUserConfig: boolean,
 *   }
 * }} options
 */
export function compasGetCli(
  event: import("@compas/stdlib").InsightEvent,
  options: {
    commandDirectories: {
      loadScripts: boolean;
      loadProjectConfig: boolean;
      loadUserConfig: boolean;
    };
  },
): Promise<{
  logger: import("@compas/stdlib/types/advanced-types").Logger;
  cli: import("../cli/types").CliResolved;
}>;
/**
 * Execute CLI
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../cli/types").CliResolved} cli
 * @param {string[]} userInput
 * @returns {Promise<{
 *   flags?: any,
 *   result: import("@compas/stdlib").Either<import("../cli/types").CliResult, { message:
 *   string }>,
 * }>}
 */
export function compasExecCli(
  event: import("@compas/stdlib").InsightEvent,
  logger: import("@compas/stdlib").Logger,
  cli: import("../cli/types").CliResolved,
  userInput: string[],
): Promise<{
  flags?: any;
  result: import("@compas/stdlib").Either<
    import("../cli/types").CliResult,
    {
      message: string;
    }
  >;
}>;
/**
 * Specify internal commands, project command directories, user command directories and
 * scripts directory.
 *
 * @param {{
 *     loadScripts: boolean,
 *     loadProjectConfig: boolean,
 *     loadUserConfig: boolean,
 * }} opts
 * @returns {Promise<{validateOnLoad: boolean, directory: string}[]>}
 */
export function getCommandDirectories(opts: {
  loadScripts: boolean;
  loadProjectConfig: boolean;
  loadUserConfig: boolean;
}): Promise<
  {
    validateOnLoad: boolean;
    directory: string;
  }[]
>;
//# sourceMappingURL=cli.d.ts.map

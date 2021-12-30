/**
 * Get the sub commands and flags in separate arrays
 *
 * @param {string[]} args
 * @returns {{ commandArgs: string[], flagArgs: string[] }}
 */
export function cliParserSplitArgs(args: string[]): {
  commandArgs: string[];
  flagArgs: string[];
};
/**
 *
 * @param {import("./types").CliResolved} command
 * @returns {Map<string, import("../generated/common/types").CliFlagDefinition>}
 */
export function cliParserGetKnownFlags(
  command: import("./types").CliResolved,
): Map<string, import("../generated/common/types").CliFlagDefinition>;
/**
 * Parse the command to use
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("./types").CliResolved} cli
 * @param {string[]} args
 * @returns {Promise<import("@compas/stdlib").Either<import("./types").CliResolved, {
 *     message: string,
 * }>>}
 */
export function cliParserParseCommand(
  event: import("@compas/stdlib").InsightEvent,
  cli: import("./types").CliResolved,
  args: string[],
): Promise<
  import("@compas/stdlib").Either<
    import("./types").CliResolved,
    {
      message: string;
    }
  >
>;
/**
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("./types").CliResolved} command
 * @param {string[]} userInput
 * @returns {Promise<import("@compas/stdlib").Either<any, { message: string }>>}
 */
export function cliParserParseFlags(
  event: import("@compas/stdlib").InsightEvent,
  command: import("./types").CliResolved,
  userInput: string[],
): Promise<
  import("@compas/stdlib").Either<
    any,
    {
      message: string;
    }
  >
>;
//# sourceMappingURL=parser.d.ts.map

/**
 * Init help command and flags. Note that we are after the validators. So be good about
 * things.
 * The help command adds all other commands as their sub commands, this way we can auto
 * complete for sub commands.
 * Also registers both `-h` and `--help`. The `-h` is officially not allowed, but works
 * after the validators.
 *
 * @param {import("./types").CliResolved} cli
 */
export function cliHelpInit(cli: import("./types").CliResolved): void;
/**
 *
 * @param {string[]} commandArgs
 * @param {string[]} flagArgs
 * @returns {boolean}
 */
export function cliHelpShouldRun(
  commandArgs: string[],
  flagArgs: string[],
): boolean;
/**
 * Print help message for the specified command
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("./types").CliResolved} cli
 * @param {string[]} userInput
 * @returns {Promise<import("@compas/stdlib").Either<string, { message: string }>>}
 */
export function cliHelpGetMessage(
  event: import("@compas/stdlib").InsightEvent,
  cli: import("./types").CliResolved,
  userInput: string[],
): Promise<
  import("@compas/stdlib").Either<
    string,
    {
      message: string;
    }
  >
>;
//# sourceMappingURL=help.d.ts.map

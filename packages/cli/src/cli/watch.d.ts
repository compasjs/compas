/**
 * Init watch command and flags.Note that we are after the validators. So be good about
 * things.
 * The watch command adds all other commands as their sub commands, this way we can auto
 * complete for sub commands.
 * Also registers `--watch`. Which special case captures the command and rewrites it to a
 * `cli.name watch ...` command.
 *
 * @param {import("./types").CliResolved} cli
 */
export function cliWatchInit(cli: import("./types").CliResolved): void;
/**
 * Make sure other commands are not using flags and command names used by the 'watch'
 * system.
 *
 * @param {import("./types").CliResolved} command
 */
export function cliWatchCheckForReservedKeys(
  command: import("./types").CliResolved,
): void;
/**
 *
 * @param {string[]} commandArgs
 * @param {string[]} flagArgs
 * @returns {boolean}
 */
export function cliWatchShouldRun(
  commandArgs: string[],
  flagArgs: string[],
): boolean;
/**
 * Execute command in watch-mode. Checking options based on the command.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("./types").CliResolved} cli
 * @param {string[]} userInput
 * @returns {Promise<import("@compas/stdlib").Either<string, { message: string }>>}
 */
export function cliWatchExec(
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
//# sourceMappingURL=watch.d.ts.map

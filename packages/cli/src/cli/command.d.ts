/**
 * Get the CLI root, skips 'help'.
 *
 * @param {import("./types").CliResolved} command
 * @returns {import("./types").CliResolved}
 */
export function cliCommandGetRoot(
  command: import("./types").CliResolved,
): import("./types").CliResolved;
/**
 * Determine the command that we are working with.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("./types").CliResolved} cli
 * @param {string[]} input
 * @returns {Promise<import("@compas/stdlib").Either<import("./types").CliResolved, {
 *   message: string }>>}
 */
export function cliCommandDetermine(
  event: import("@compas/stdlib").InsightEvent,
  cli: import("./types").CliResolved,
  input: string[],
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
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("./types").CliResolved} cli
 * @param {import("./types").CliResolved} command
 * @param {Record<string, any>} flags
 * @param {string[]} userInput
 * @returns {Promise<import("@compas/stdlib").Either<import("./types").CliResult, {
 *   message: string }>>}
 */
export function cliCommandExec(
  event: import("@compas/stdlib").InsightEvent,
  logger: import("@compas/stdlib").Logger,
  cli: import("./types").CliResolved,
  command: import("./types").CliResolved,
  flags: Record<string, any>,
  userInput: string[],
): Promise<
  import("@compas/stdlib").Either<
    import("./types").CliResult,
    {
      message: string;
    }
  >
>;
//# sourceMappingURL=command.d.ts.map

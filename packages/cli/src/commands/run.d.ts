/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @returns {Promise<void | { exitCode: number; }>}
 */
export function runCommand(
  logger: Logger,
  command: import("../parse").ExecCommand,
): Promise<void | {
  exitCode: number;
}>;
//# sourceMappingURL=run.d.ts.map

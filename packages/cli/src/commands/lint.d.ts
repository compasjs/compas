/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @returns {Promise<void | { exitCode: number; }>}
 */
export function lintCommand(
  logger: Logger,
  command: import("../parse").ExecCommand,
): Promise<void | {
  exitCode: number;
}>;
//# sourceMappingURL=lint.d.ts.map

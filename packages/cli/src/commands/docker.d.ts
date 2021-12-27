/**
 * @param {Logger} logger
 * @param {import("../parse").UtilCommand} command
 * @returns {Promise<{ exitCode?: number }|void>}
 */
export function dockerCommand(
  logger: Logger,
  command: import("../parse").UtilCommand,
): Promise<{
  exitCode?: number;
} | void>;
//# sourceMappingURL=docker.d.ts.map

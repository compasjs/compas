/**
 * @param {Logger} logger
 * @param {import("../parse").UtilCommand} command
 * @returns {Promise<{ exitCode?: number }|void>}
 */
export function dockerMigrateCommand(logger: Logger, command: import("../parse").UtilCommand): Promise<void | {
    exitCode?: number | undefined;
}>;
//# sourceMappingURL=index.d.ts.map
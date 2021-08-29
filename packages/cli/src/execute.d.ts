/**
 * @param {Logger} logger
 * @param {import("./parse").UtilCommand|import("./parse").ExecCommand} command
 * @param {import("./utils").ScriptCollection} scriptCollection
 * @returns {Promise<{ exitCode: number }|void>|void}
 */
export function execute(logger: Logger, command: import("./parse").UtilCommand | import("./parse").ExecCommand, scriptCollection: import("./utils").ScriptCollection): Promise<{
    exitCode: number;
} | void> | void;
//# sourceMappingURL=execute.d.ts.map
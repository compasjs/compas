/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @param {import("../utils").ScriptCollection} scriptCollection
 * @returns {Promise<void | { exitCode: number; }>}
 */
export function runCommand(logger: Logger, command: import("../parse").ExecCommand, scriptCollection: import("../utils").ScriptCollection): Promise<void | {
    exitCode: number;
}>;
//# sourceMappingURL=run.d.ts.map
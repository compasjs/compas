/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @returns {Promise<{ exitCode: number}|void>|void}
 */
export function benchCommand(logger: Logger, command: import("../parse").ExecCommand): Promise<{
    exitCode: number;
} | void> | void;
export const benchFile: string;
//# sourceMappingURL=bench.d.ts.map
/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @returns {void | Promise<void | { exitCode: number; }>}
 */
export function testCommand(logger: Logger, command: import("../parse").ExecCommand): void | Promise<void | {
    exitCode: number;
}>;
export const testFile: string;
//# sourceMappingURL=test.d.ts.map
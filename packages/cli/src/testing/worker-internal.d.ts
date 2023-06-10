/// <reference types="node" />
/**
 * List available test files
 *
 * @property {import("./config").TestConfig} testConfig
 * @returns {Promise<string[]>}
 */
export function testingListFiles(testConfig: any): Promise<string[]>;
/**
 * @param {import("./config").TestConfig} testConfig
 * @returns {Promise<number>}
 */
export function runTestsInProcess(
  testConfig: import("./config").TestConfig,
): Promise<number>;
export const workerFile: import("url").URL;
//# sourceMappingURL=worker-internal.d.ts.map

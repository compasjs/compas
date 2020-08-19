import { exec, pathJoin } from "@lbu/stdlib";

/**
 * @param {string} testName
 * @returns {string}
 */
export function getTestMediaPath(testName) {
  return pathJoin(process.cwd(), "docs/_media/howto", `${testName}.js`);
}

/**
 * @param testName
 * @returns {Promise<{exitCode: number, stderr: string, stdout: string}>}
 */
export async function execTestFile(testName) {
  return exec(`node ${getTestMediaPath(testName)}`);
}

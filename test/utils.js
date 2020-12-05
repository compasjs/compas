import { exec, pathJoin } from "@compas/stdlib";

/**
 * @param {string} testName
 * @returns {string}
 */
export function getTestMediaPath(testName) {
  return pathJoin(process.cwd(), "assets/examples/", `${testName}.js`);
}

/**
 * @param testName
 * @returns {Promise<{exitCode: number, stderr: string, stdout: string}>}
 */
export async function execTestFile(testName) {
  return exec(`node ${getTestMediaPath(testName)}`);
}

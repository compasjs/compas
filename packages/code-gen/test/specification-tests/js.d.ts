/**
 * @typedef {object} SpecResult
 * @property {import("@compas/stdlib").Logger} log
 * @property {number} passed
 * @property {number} skipped
 * @property {number} failed
 * @property {{
 *   name: string,
 *   index: number,
 * }[]} suites
 * @property {any[]} extraLogs
 */
/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {{ enableFullLogging: boolean }} options
 */
export function specificationTestsRun(
  logger: import("@compas/stdlib").Logger,
  options: {
    enableFullLogging: boolean;
  },
): Promise<void>;
export type SpecResult = {
  log: import("@compas/stdlib").Logger;
  passed: number;
  skipped: number;
  failed: number;
  suites: {
    name: string;
    index: number;
  }[];
  extraLogs: any[];
};
//# sourceMappingURL=js.d.ts.map

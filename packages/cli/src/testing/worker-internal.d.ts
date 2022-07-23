/// <reference types="node" />
/**
 * List available test files
 *
 * @returns {Promise<string[]>}
 */
export function listTestFiles(): Promise<string[]>;
/**
 * @param {{
 *   singleFileMode: boolean
 * }} [options]
 * @returns {Promise<number>}
 */
export function runTestsInProcess(
  options?:
    | {
        singleFileMode: boolean;
      }
    | undefined,
): Promise<number>;
export const workerFile: import("url").URL;
//# sourceMappingURL=worker-internal.d.ts.map

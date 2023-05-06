/**
 * Fully run the generators and return the output files
 *
 * @deprecated
 *
 * @param {Parameters<Parameters<typeof import("@compas/cli").test>[1]>[0]} t
 * @param {import("./generated/common/types.js").ExperimentalGenerateOptions} options
 * @param {import("./generated/common/types.js").ExperimentalStructure} [structure]
 * @returns {import("./generate.js").OutputFile[]}
 */
export function testExperimentalGenerateFiles(
  t: Parameters<
    [
      name: string,
      callback: import("@compas/cli/src/testing/state.js").TestCallback,
    ][1]
  >[0],
  options: import("./generated/common/types.js").ExperimentalGenerateOptions,
  structure?:
    | import("./generated/common/types.js").ExperimentalStructure
    | undefined,
): import("./generate.js").OutputFile[];
//# sourceMappingURL=testing.d.ts.map

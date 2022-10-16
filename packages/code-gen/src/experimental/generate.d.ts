/**
 * @typedef {object} GenerateContext
 * @property {import("@compas/stdlib").Logger} log
 * @property {import("./generated/common/types.js").ExperimentalGenerateOptions} options
 * @property {import("./generated/common/types.js").ExperimentalStructure} structure
 * @property {{
 *   contents: string,
 *   relativePath: string,
 * }[]} outputFiles
 */
/**
 * Execute the generators based on de provided Generator instance and included options.
 *
 * @param {import("./generator").Generator} generator
 * @param {import("./generated/common/types").ExperimentalGenerateOptions} options
 * @returns {GenerateContext["outputFiles"]}
 */
export function generateExecute(
  generator: import("./generator").Generator,
  options: import("./generated/common/types").ExperimentalGenerateOptions,
): GenerateContext["outputFiles"];
/**
 * Write output files if an output directory is provided
 *
 * @param {GenerateContext} generateContext
 */
export function generateWriteOutputFiles(
  generateContext: GenerateContext,
): void;
export type GenerateContext = {
  log: import("@compas/stdlib").Logger;
  options: import("./generated/common/types.js").ExperimentalGenerateOptions;
  structure: import("./generated/common/types.js").ExperimentalStructure;
  outputFiles: {
    contents: string;
    relativePath: string;
  }[];
};
//# sourceMappingURL=generate.d.ts.map

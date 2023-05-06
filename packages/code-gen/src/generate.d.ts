/**
 * @typedef {object} OutputFile
 * @property {string} contents
 * @property {string} relativePath
 */
/**
 * @typedef {object} GenerateContext
 * @property {import("@compas/stdlib").Logger} log
 * @property {import("./generated/common/types.d.ts").ExperimentalGenerateOptions} options
 * @property {import("./generated/common/types.d.ts").ExperimentalStructure} structure
 * @property {import("./file/context.js").GenerateFileMap} files
 */
/**
 * Execute the generators based on de provided Generator instance and included options.
 *
 * TODO: expand docs
 *
 * - flat structure, no resolved references
 * - Preprocess everything
 * - talk about caching
 * - targetLanguageSwitch & targetCustomSwitch
 *
 * @param {import("./generator.js").Generator} generator
 * @param {import("./generated/common/types.js").ExperimentalGenerateOptions} options
 * @returns {OutputFile[]}
 */
export function generateExecute(
  generator: import("./generator.js").Generator,
  options: import("./generated/common/types.js").ExperimentalGenerateOptions,
): OutputFile[];
/**
 * Write output files if an output directory is provided
 *
 * @param {GenerateContext} generateContext
 * @param {OutputFile[]} outputFiles
 */
export function generateWriteOutputFiles(
  generateContext: GenerateContext,
  outputFiles: OutputFile[],
): void;
export type OutputFile = {
  contents: string;
  relativePath: string;
};
export type GenerateContext = {
  log: import("@compas/stdlib").Logger;
  options: import("./generated/common/types.d.ts").ExperimentalGenerateOptions;
  structure: import("./generated/common/types.d.ts").ExperimentalStructure;
  files: import("./file/context.js").GenerateFileMap;
};
//# sourceMappingURL=generate.d.ts.map

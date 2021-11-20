/**
 *
 * @param {Logger} logger
 * @param {GenerateOpts} options
 * @param {import("../generated/common/types").CodeGenStructure} structure
 * @returns {Promise<void>}
 */
export function generate(
  logger: Logger,
  options: GenerateOpts,
  structure: import("../generated/common/types").CodeGenStructure,
): Promise<void>;
/**
 * Use the fileHeader from options, and prefix all file contents with it
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function annotateFilesWithHeader(
  context: import("../generated/common/types").CodeGenContext,
): void;
/**
 * Write out all files
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function writeFiles(
  context: import("../generated/common/types").CodeGenContext,
): void;
/**
 * Check if we should generate ES Modules based on the package.json
 *
 * @param {Logger} logger
 * @returns {boolean}
 */
export function shouldGenerateModules(logger: Logger): boolean;
//# sourceMappingURL=index.d.ts.map

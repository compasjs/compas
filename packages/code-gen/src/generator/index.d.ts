/**
 *
 * @param {Logger} logger
 * @param {GenerateOpts} options
 * @param {CodeGenStructure} structure
 * @returns {Promise<void>}
 */
export function generate(logger: Logger, options: any, structure: CodeGenStructure): Promise<void>;
/**
 * Use the fileHeader from options, and prefix all file contents with it
 *
 * @param {CodeGenContext} context
 */
export function annotateFilesWithHeader(context: CodeGenContext): void;
/**
 * Write out all files
 *
 * @param {CodeGenContext} context
 */
export function writeFiles(context: CodeGenContext): void;
/**
 * Check if we should generate ES Modules based on the package.json
 *
 * @param {Logger} logger
 * @returns {boolean}
 */
export function shouldGenerateModules(logger: Logger): boolean;
//# sourceMappingURL=index.d.ts.map
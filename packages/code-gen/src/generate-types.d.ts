/**
 * @typedef {object} GenerateTypeOpts
 * @property {string} outputDirectory
 * @property {string[]} inputPaths
 * @property {boolean|string[]|undefined} [dumpCompasTypes]
 * @property {boolean|undefined} [verbose]
 * @property {string|undefined} [fileHeader]
 */
/**
 * @param {Logger} logger
 * @param {GenerateTypeOpts} options
 * @returns {Promise<void>}
 */
export function generateTypes(logger: Logger, options: GenerateTypeOpts): Promise<void>;
export type GenerateTypeOpts = {
    outputDirectory: string;
    inputPaths: string[];
    dumpCompasTypes?: boolean | string[] | undefined;
    verbose?: boolean | undefined;
    fileHeader?: string | undefined;
};
//# sourceMappingURL=generate-types.d.ts.map
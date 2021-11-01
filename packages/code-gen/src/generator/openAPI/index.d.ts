/**
 * @typedef {object} OpenApiOpts
 * @property {string|undefined} [version]
 * @property {string|undefined} [title]
 * @property {string|undefined} [description]
 * @property {any[]|undefined} [servers]
 */
/**
 * @typedef {object} GenerateOpenApiOpts
 * @property {string} inputPath
 * @property {string} outputFile
 * @property {OpenApiOpts} [openApiOptions]
 * @property {string[]|undefined} [enabledGroups]
 * @property {boolean|undefined} [verbose]
 */
/**
 * @param {Logger} logger
 * @param {GenerateOpenApiOpts} options
 * @returns {Promise<void>}
 */
export function generateOpenApi(
  logger: Logger,
  options: GenerateOpenApiOpts,
): Promise<void>;
export type OpenApiOpts = {
  version?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  servers?: any[] | undefined;
};
export type GenerateOpenApiOpts = {
  inputPath: string;
  outputFile: string;
  openApiOptions?: OpenApiOpts | undefined;
  enabledGroups?: string[] | undefined;
  verbose?: boolean | undefined;
};
//# sourceMappingURL=index.d.ts.map

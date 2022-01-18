/**
 * @typedef {object} OpenApiExtensions
 * @property {OpenApiExtensionsInfo} [info]
 * @property {any[]} [servers]
 * @property {any[]} [components]
 */
/**
 * @typedef {object} OpenApiExtensionsInfo
 * @property {string} [version]
 * @property {string} [title]
 * @property {string} [description]
 */
/**
 * @typedef {Object<string,object>} OpenApiRouteExtensions
 */
/**
 * @typedef {object} GenerateOpenApiOpts
 * @property {string} inputPath
 * @property {string} outputFile
 * @property {string[]} [enabledGroups]
 * @property {boolean} [verbose]
 * @property {OpenApiExtensions} [openApiExtensions]
 * @property {OpenApiRouteExtensions} [openApiRouteExtensions]
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
export type OpenApiExtensions = {
  info?: OpenApiExtensionsInfo | undefined;
  servers?: any[] | undefined;
  components?: any[] | undefined;
};
export type OpenApiExtensionsInfo = {
  version?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
};
export type OpenApiRouteExtensions = {
  [x: string]: object;
};
export type GenerateOpenApiOpts = {
  inputPath: string;
  outputFile: string;
  enabledGroups?: string[] | undefined;
  verbose?: boolean | undefined;
  openApiExtensions?: OpenApiExtensions | undefined;
  openApiRouteExtensions?:
    | {
        [x: string]: any;
      }
    | undefined;
};
//# sourceMappingURL=index.d.ts.map

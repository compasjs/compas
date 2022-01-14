/**
 * @typedef {object} OpenApiExtensions
 * @property {string} [version]
 * @property {string} [title]
 * @property {string} [description]
 * @property {any[]} [servers]
 * @property {any[]} [components]
 */
/**
 * @typedef {object} GenerateOpenApiOpts
 * @property {string} inputPath
 * @property {string} outputFile
 * @property {OpenApiExtensions} [openApiExtensions]
 * @property {Object<string,{security:string[]}>} [routeExtensions]
 * @property {string[]} [enabledGroups]
 * @property {boolean} [verbose]
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
  version?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  servers?: any[] | undefined;
  components?: any[] | undefined;
};
export type GenerateOpenApiOpts = {
  inputPath: string;
  outputFile: string;
  openApiExtensions?: OpenApiExtensions | undefined;
  routeExtensions?:
    | {
        [x: string]: {
          security: string[];
        };
      }
    | undefined;
  enabledGroups?: string[] | undefined;
  verbose?: boolean | undefined;
};
//# sourceMappingURL=index.d.ts.map

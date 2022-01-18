/**
 * @typedef GenerateOpenApiFileOpts
 * @property {import("./index.js").OpenApiExtensions} openApiExtensions
 * @property {import("./index.js").OpenApiRouteExtensions} openApiRouteExtensions
 * @property {string[]} enabledGroups
 * @property {boolean} verbose
 */
/**
 * @param {import("../../generated/common/types").CodeGenStructure} structure
 * @param {GenerateOpenApiFileOpts} options
 * @returns {string}
 */
export function generateOpenApiFile(
  structure: import("../../generated/common/types").CodeGenStructure,
  options: GenerateOpenApiFileOpts,
): string;
export type GenerateOpenApiFileOpts = {
  openApiExtensions: import("./index.js").OpenApiExtensions;
  openApiRouteExtensions: import("./index.js").OpenApiRouteExtensions;
  enabledGroups: string[];
  verbose: boolean;
};
//# sourceMappingURL=generator.d.ts.map

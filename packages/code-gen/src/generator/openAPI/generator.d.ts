/**
 * @typedef GenerateOpenApiFileOpts
 * @property {import("./index.js").OpenApiOpts} openApiOptions
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
  openApiOptions: import("./index.js").OpenApiOpts;
  enabledGroups: string[];
  verbose: boolean;
};
//# sourceMappingURL=generator.d.ts.map

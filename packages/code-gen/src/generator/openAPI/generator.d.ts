/**
 * @typedef GenerateOpenApiFileOpts
 * @property {import("./index.js").OpenApiOpts} openApiOptions
 * @property {string[]} enabledGroups
 * @property {boolean} verbose
 */
/**
 * @param {CodeGenStructure} structure
 * @param {GenerateOpenApiFileOpts} options
 * @returns {string}
 */
export function generateOpenApiFile(
  structure: CodeGenStructure,
  options: GenerateOpenApiFileOpts,
): string;
export type GenerateOpenApiFileOpts = {
  openApiOptions: import("./index.js").OpenApiOpts;
  enabledGroups: string[];
  verbose: boolean;
};
//# sourceMappingURL=generator.d.ts.map

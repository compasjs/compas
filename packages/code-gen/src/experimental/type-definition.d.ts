/**
 * @typedef {object} TypeDefinitionHelper
 * @property {import("./structure").structureExtractReferences} structureExtractReferences
 * @property {import("./structure").structureIncludeReferences} structureIncludeReferences
 */
/**
 * @type {Record<
 *   import("./generated/common/types").ExperimentalTypeDefinition["type"],
 *   TypeDefinitionHelper
 * >}
 */
export const typeDefinitionHelpers: Record<
  import("./generated/common/types").ExperimentalTypeDefinition["type"],
  TypeDefinitionHelper
>;
export type TypeDefinitionHelper = {
  structureExtractReferences: typeof import("./structure.js").structureExtractReferences;
  structureIncludeReferences: typeof import("./structure.js").structureIncludeReferences;
};
//# sourceMappingURL=type-definition.d.ts.map

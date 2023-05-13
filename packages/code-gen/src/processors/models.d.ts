/**
 * Get a list of query enabled objects in the structure.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {(import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureObjectDefinition>)[]}
 */
export function structureModels(
  generateContext: import("../generate.js").GenerateContext,
): import("../../types/advanced-types").NamedType<
  import("../generated/common/types").StructureObjectDefinition
>[];
/**
 * Return a new generic any type for custom query parts
 *
 * @returns {import("../builders/AnyType.js").AnyType}
 */
export function modelQueryPartType(): import("../builders/AnyType.js").AnyType;
//# sourceMappingURL=models.d.ts.map

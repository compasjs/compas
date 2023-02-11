/**
 * Get a list of query enabled objects in the structure.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {(import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>)[]}
 */
export function structureModels(
  generateContext: import("../generate").GenerateContext,
): import("../types").NamedType<
  import("../generated/common/types").ExperimentalObjectDefinition
>[];
/**
 * Return a new generic any type for custom query parts
 *
 * @returns {import("../../builders/AnyType").AnyType}
 */
export function modelQueryPartType(): import("../../builders/AnyType").AnyType;
//# sourceMappingURL=models.d.ts.map

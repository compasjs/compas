/**
 * Check if the provided type should be generated as an optional type.
 * When {@link options.validatorState} is set to 'output', we expect that defaults are
 * applied.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureTypeSystemDefinition} type
 * @param {Pick<import("./generator.js").GenerateTypeOptions, "validatorState">} options
 * @returns {boolean}
 */
export function typesOptionalityIsOptional(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../generated/common/types.js").StructureTypeSystemDefinition,
  options: Pick<import("./generator.js").GenerateTypeOptions, "validatorState">,
): boolean;
/**
 * Check if the type recursively has optionality differences
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureTypeSystemDefinition} type
 * @returns {boolean}
 */
export function typesHasDifferentTypeAfterValidators(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../generated/common/types.js").StructureTypeSystemDefinition,
): boolean;
//# sourceMappingURL=optionality.d.ts.map

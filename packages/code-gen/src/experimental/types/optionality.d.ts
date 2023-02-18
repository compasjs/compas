/**
 * Check if the provided type should be generated as an optional type.
 * When {@link options.validatorState} is set to 'output', we expect that defaults are
 * applied.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {Pick<import("./generator").GenerateTypeOptions, "validatorState">} options
 * @returns {boolean}
 */
export function typesOptionalityIsOptional(
  generateContext: import("../generate").GenerateContext,
  type: import("../generated/common/types").ExperimentalTypeSystemDefinition,
  options: Pick<import("./generator").GenerateTypeOptions, "validatorState">,
): boolean;
/**
 * Check if the type recursively has optionality differences
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @returns {boolean}
 */
export function typesHasDifferentTypeAfterValidators(
  generateContext: import("../generate").GenerateContext,
  type: import("../generated/common/types").ExperimentalTypeSystemDefinition,
): boolean;
//# sourceMappingURL=optionality.d.ts.map

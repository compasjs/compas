/**
 * Resolve some property from the provided type, prioritizing the settings on the
 * reference type and then checking the referenced type. Can be called even if the type
 * is not a reference.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {(string|number)[]} accessPath
 * @param {any} [defaultValue]
 * @returns {any}
 */
export function referenceUtilsGetProperty(
  generateContext: import("../generate").GenerateContext,
  type: import("../generated/common/types").ExperimentalTypeSystemDefinition,
  accessPath: (string | number)[],
  defaultValue?: any,
): any;
//# sourceMappingURL=reference-utils.d.ts.map

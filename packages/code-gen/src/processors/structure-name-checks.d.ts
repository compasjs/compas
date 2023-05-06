/**
 * Check the full structure if a reserved name is used.
 *
 * These reserved names are not target language specific, so when adding support for a
 * new target language, it could be a breaking change for users of other targets. This
 * is done so a valid structure can be generated to all supported targets.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function structureNameChecks(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Execute the group name check on the provided name.
 *
 * @param {string} group
 */
export function structureNameCheckForGroup(group: string): void;
/**
 * Execute the check on this object keys.
 *
 * Objects shouldn't use reserved keys, since that breaks the atomic database updates
 * that we support.
 *
 * @param {import("../generated/common/types.js").ExperimentalObjectDefinition} type
 * @param {string[]} typeStack
 */
export function structureNameChecksForObject(
  type: import("../generated/common/types.js").ExperimentalObjectDefinition,
  typeStack: string[],
): void;
//# sourceMappingURL=structure-name-checks.d.ts.map

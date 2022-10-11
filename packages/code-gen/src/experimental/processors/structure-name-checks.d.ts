/**
 * Check the full structure if a reserved name is used.
 *
 * These reserved names are not target language specific, so when adding support for a
 * new target language, it could be a breaking change for users of other targets. This
 * is done so a valid structure can be generated to all supported targets.
 *
 * @param {import("../generate").GenerateContext} ctx
 */
export function structureNameChecks(
  ctx: import("../generate").GenerateContext,
): void;
/**
 * Execute the check on the provided type.
 *
 * @param {string} group
 */
export function structureNameCheckForGroup(group: string): void;
/**
 * Execute the check on this object keys
 *
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} type
 * @param {string[]} typeStack
 */
export function structureNameChecksForObject(
  type: import("../generated/common/types").ExperimentalObjectDefinition,
  typeStack: string[],
): void;
//# sourceMappingURL=structure-name-checks.d.ts.map

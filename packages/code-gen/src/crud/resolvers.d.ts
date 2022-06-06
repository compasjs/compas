/**
 * Create a route name based on parent names
 *
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {string} suffix
 * @returns {string}
 */
export function crudCreateName(
  type: import("../generated/common/types.js").CodeGenCrudType,
  suffix: string,
): string;
/**
 * Find the group that this crud type belongs to.
 *
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @returns {string}
 */
export function crudResolveGroup(
  type: import("../generated/common/types.js").CodeGenCrudType,
): string;
//# sourceMappingURL=resolvers.d.ts.map

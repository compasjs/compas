/**
 * Validate and add CRUD types.
 * Note that we are in a 'bare' land here.
 * No reference is resolved, so needs to be looked up and things like relations between
 * query enabled objects are not resolved yet.
 *
 * To accommodate this, there will be a need for various utilities to look references up
 * and resolve types of 'virtual' relation fields.
 *
 * @param {import("../generated/common/types.js").CodeGenContext} context
 */
export function crudPreprocess(
  context: import("../generated/common/types.js").CodeGenContext,
): void;
//# sourceMappingURL=preprocessor.d.ts.map

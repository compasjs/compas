/**
 * Create the implementation of the controllers, including hooks
 *
 * @param {import("../generated/common/types.js").CodeGenContext} context
 */
export function crudGenerateRouteImplementations(
  context: import("../generated/common/types.js").CodeGenContext,
): void;
/**
 * @param {any} builder
 * @returns {string}
 */
export function crudFormatBuilder(builder: any): string;
/**
 *
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {{
 *   includeOwnParam: boolean,
 *   includeJoins: boolean,
 *   traverseParents: boolean,
 *   partial: any }} opts
 * @returns {any}
 */
export function crudGetBuilder(
  type: import("../generated/common/types.js").CodeGenCrudType,
  {
    includeOwnParam,
    includeJoins,
    traverseParents,
    partial,
  }: {
    includeOwnParam: boolean;
    includeJoins: boolean;
    traverseParents: boolean;
    partial: any;
  },
): any;
//# sourceMappingURL=route-implementer.d.ts.map

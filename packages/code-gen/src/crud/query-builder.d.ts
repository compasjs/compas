/**
 * Get the query builder to use for the provided crud and options
 *
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 * @param {{
 *   includeOwnParam: boolean,
 *   includeJoins: boolean,
 *   traverseParents: boolean,
 *   partial?: Record<string, any>,
 * }} options
 * @returns {string}
 */
export function crudQueryBuilderGet(
  crud: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").ExperimentalCrudDefinition
  >,
  options: {
    includeOwnParam: boolean;
    includeJoins: boolean;
    traverseParents: boolean;
    partial?: Record<string, any>;
  },
): string;
//# sourceMappingURL=query-builder.d.ts.map

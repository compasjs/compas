/**
 * Wrap a queryPart & validator in something that can either be used directly, or can be chained.
 *
 * @template {function} T
 *
 * @param {import("@compas/store").QueryPart<any>} queryPart
 * @param {T} validator
 * @param {{ hasCustomReturning: boolean }} options
 * @returns {import("@compas/store").WrappedQueryPart<NonNullable<ReturnType<T>["value"]>>}
 */
export function wrapQueryPart<T extends Function>(
  queryPart: import("@compas/store").QueryPart<any>,
  validator: T,
  options: {
    hasCustomReturning: boolean;
  },
): import("../../..").WrappedQueryPart<NonNullable<ReturnType<T>["value"]>>;
//# sourceMappingURL=database-helpers.d.ts.map

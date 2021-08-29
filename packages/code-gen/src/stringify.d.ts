/**
 * Consistent stringify type. Oh boi, if you ever use util.inspect on a big type...
 * Only works with validator and type generators, ignores routes, relations and sql
 * settings. When includeSqlRelated is set to true, will also check, enableQueries,
 * queryOptions, sql and relations
 *
 * @param {CodeGenType} type
 * @param {boolean} [includeSqlRelated=false]
 * @returns {string}
 */
export function stringifyType(type: CodeGenType, includeSqlRelated?: boolean | undefined): string;
//# sourceMappingURL=stringify.d.ts.map
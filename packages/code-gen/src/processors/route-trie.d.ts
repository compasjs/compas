/**
 * Build a route trie
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function routeTrieBuild(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Get the cached route trie
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {RouteTrie}
 */
export function routeTrieGet(
  generateContext: import("../generate.js").GenerateContext,
): RouteTrie;
/**
 * Remove unnecessary trie nodes, and collapse static trie nodes as much as possible.
 *
 * @param {RouteTrie} trie
 */
export function trieCleanAndCollapse(trie: RouteTrie): void;
/**
 * Sort the route trie to optimize the matching later on.
 *
 * @param {RouteTrie} trie
 */
export function trieSort(trie: RouteTrie): void;
export type RouteTrie = {
  route?:
    | import("../generated/common/types.js").StructureRouteDefinition
    | undefined;
  prio: keyof typeof RoutePrio;
  children: RouteTrie[];
  parent?: RouteTrie | undefined;
  path: string;
  paramName?: string | undefined;
};
/**
 * Route prio's used for sorting.
 *
 * @type {{WILDCARD: "WILDCARD", PARAM: "PARAM", STATIC: "STATIC"}}
 */
declare const RoutePrio: {
  WILDCARD: "WILDCARD";
  PARAM: "PARAM";
  STATIC: "STATIC";
};
export {};
//# sourceMappingURL=route-trie.d.ts.map

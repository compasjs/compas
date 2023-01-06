/**
 * Build a route trie
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function routeTrieBuild(
  generateContext: import("../generate").GenerateContext,
): void;
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
    | import("../generated/common/types").ExperimentalRouteDefinition
    | undefined;
  prio: string;
  children: RouteTrie[];
  parent?: RouteTrie | undefined;
  path: string;
  paramName?: string | undefined;
};
//# sourceMappingURL=route-trie.d.ts.map

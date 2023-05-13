import { AppError } from "@compas/stdlib";
import {
  errorsThrowCombinedError,
  stringFormatNameForError,
} from "../utils.js";
import { structureRoutes } from "./routes.js";

/**
 * @typedef {object} RouteTrie
 * @property {import("../generated/common/types.js").StructureRouteDefinition} [route]
 * @property {keyof typeof RoutePrio} prio
 * @property {RouteTrie[]} children
 * @property {RouteTrie} [parent]
 * @property {string} path
 * @property {string} [paramName]
 */

/**
 * Cache the created route trie
 *
 * @type {WeakMap<object, RouteTrie>}
 */
const routeTrieCache = new WeakMap();

/**
 * Route prio's used for sorting.
 *
 * @type {{WILDCARD: "WILDCARD", PARAM: "PARAM", STATIC: "STATIC"}}
 */
const RoutePrio = {
  STATIC: "STATIC",
  PARAM: "PARAM",
  WILDCARD: "WILDCARD",
};

/**
 * Build a route trie
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function routeTrieBuild(generateContext) {
  /** @type {import("@compas/stdlib").AppError[]} */
  const errors = [];
  const trie = trieCreateNode("");

  for (const route of structureRoutes(generateContext)) {
    if (route.path.startsWith("/")) {
      route.path = route.path.slice(1);
    }

    const fullPath = `${route.method}/${route.path}`;

    try {
      trieAddRoute(
        trie,
        fullPath.split("/").filter((it) => it.trim() !== ""),
        route,
      );
    } catch (/** @type {any} */ e) {
      errors.push(e);
    }
  }

  errorsThrowCombinedError(errors);

  trieCleanAndCollapse(trie);
  trieSort(trie);

  routeTrieCache.set(generateContext, trie);
}

/**
 * Get the cached route trie
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {RouteTrie}
 */
export function routeTrieGet(generateContext) {
  return routeTrieCache.get(generateContext) ?? trieCreateNode("");
}

/**
 * Remove unnecessary trie nodes, and collapse static trie nodes as much as possible.
 *
 * @param {RouteTrie} trie
 */
export function trieCleanAndCollapse(trie) {
  for (const child of trie.children) {
    trieCleanAndCollapse(child);
  }

  trie.children = trie.children.filter(
    (it) => it.route || it.children.length > 0,
  );

  if (trie.prio !== RoutePrio.STATIC) {
    // We can't collapse if the parent is not a static node.
    return;
  }

  if (trie.route) {
    // We can't collapse if this static node is a named route, else it can never be
    // matched.
    return;
  }

  if (!trie.parent) {
    // We won't collapse the root node
    return;
  }

  for (const child of trie.children) {
    if (child.prio !== RoutePrio.STATIC) {
      // We can't collapse if any of the children is not a static node
      return;
    }
  }

  // Do the collapsing.
  const parent = trie.parent;
  const path = trie.path;

  parent.children = parent.children.filter((it) => it !== trie);

  for (const child of trie.children) {
    child.path = `${path}/${child.path}`;
    child.parent = parent;
    parent.children.push(child);
  }
}

/**
 * Sort the route trie to optimize the matching later on.
 *
 * @param {RouteTrie} trie
 */
export function trieSort(trie) {
  /** @type {Record<keyof RoutePrio, number>} */
  const prioSort = {
    STATIC: 0,
    PARAM: 1,
    WILDCARD: 2,
  };

  trie.children.sort((a, b) => {
    // Sort prio ASC
    const result = prioSort[a.prio] - prioSort[b.prio];
    if (result !== 0) {
      return result;
    }

    // Or path length DESC
    return b.path.length - a.path.length;
  });

  for (const child of trie.children) {
    trieSort(child);
  }
}

/**
 *
 * @param {string} path
 * @param {RouteTrie["route"]} [route]
 * @returns {RouteTrie}
 */
function trieCreateNode(path, route) {
  /** @type {RouteTrie} */
  const node = {
    children: [],
    prio: path.includes("*")
      ? RoutePrio.WILDCARD
      : path.includes(":")
      ? RoutePrio.PARAM
      : RoutePrio.STATIC,
    path,
    route,
  };

  if (node.prio === RoutePrio.PARAM) {
    node.paramName = node.path.slice(1);
  }

  return node;
}

/**
 * Add a route to the trie
 *
 * @param {RouteTrie} trie
 * @param {string[]} pathSegments
 * @param {RouteTrie["route"]} route
 */
function trieAddRoute(trie, pathSegments, route) {
  const currentPath = pathSegments[0];

  let matchedChild = trie.children.find((it) => it.path === currentPath);

  if (!matchedChild) {
    if (trie.prio === RoutePrio.WILDCARD) {
      throw AppError.serverError({
        message: `Route ${stringFormatNameForError(
          route,
        )} uses a wildcard ('*') before static path segments. Wildcards can only be used as the last path segment.`,
      });
    }

    matchedChild = trieCreateNode(currentPath);
    matchedChild.parent = trie;
    trie.children.push(matchedChild);
  }

  if (pathSegments.length === 1) {
    if (matchedChild.route) {
      throw AppError.serverError({
        message: `Route ${stringFormatNameForError(
          route,
        )} and ${stringFormatNameForError(
          matchedChild.route,
        )} share the same route path & method. Make sure that each named route uses a unique path & method combination. If that is not possible for your use case, you can use wildcards ('/foo/bar/*') or params ('/foo/:bar').`,
      });
    } else {
      matchedChild.route = route;
    }
  } else {
    trieAddRoute(matchedChild, pathSegments.slice(1), route);
  }
}

import { logger } from "../logger";
import { Route, RoutePrio, RouteTrie } from "../types";

export function constructTrieFromRouteList(routes: Route[]): RouteTrie {
  const trie: RouteTrie = createNode("", undefined);
  addHttpMethods(trie);

  for (const route of routes) {
    addRoute(trie, [route.method, ...route.path.split("/")], route);
  }

  // Don't collapse top level
  for (const child of trie.children) {
    cleanTrieAndCollapse(child);
  }

  // Remove unneeded 'HTTP-method' children
  trie.children = trie.children.filter(
    it => it.children.length > 0 || it.handler !== undefined,
  );

  sortTrie(trie);

  return trie;
}

function createNode(path: string, handler?: Route): RouteTrie {
  let prio = RoutePrio.STATIC;
  if (path === "*") {
    prio = RoutePrio.WILDCARD;
  } else if (path.startsWith(":")) {
    prio = RoutePrio.PARAM;
  }

  return {
    children: [],
    prio,
    path,
    handler,
  };
}

function addHttpMethods(trie: RouteTrie) {
  trie.children.push(
    createNode("GET"),
    createNode("POST"),
    createNode("PUT"),
    createNode("DELETE"),
    createNode("HEAD"),
  );
}

function addRoute(trie: RouteTrie, path: string[], route: Route) {
  const currentPath = path[0];

  let child = trie.children.find(it => it.path === currentPath);
  if (!child) {
    child = createNode(currentPath, undefined);
    if (trie.prio === RoutePrio.WILDCARD) {
      throw new Error("Can't have sub routes on wildcard routes.");
    }
    trie.children.push(child);
  }

  if (path.length === 1) {
    child.handler = route;
  } else {
    addRoute(child, path.slice(1), route);
  }
}

function cleanTrieAndCollapse(trie: RouteTrie) {
  // Remove nodes without handler & without children
  trie.children = trie.children.filter(
    it => it.handler !== undefined || it.children.length > 0,
  );

  for (const child of trie.children) {
    cleanTrieAndCollapse(child);
  }

  // Collaps unnecessary STATIC nodes
  if (
    trie.children.length === 1 &&
    trie.handler === undefined &&
    trie.prio === RoutePrio.STATIC &&
    trie.children[0].prio === RoutePrio.STATIC
  ) {
    const child = trie.children[0];
    trie.path = trie.path + "/" + child.path;
    trie.handler = child.handler;
    trie.children = child.children;
  }
}

function sortTrie(trie: RouteTrie) {
  trie.children = trie.children.sort((a, b) => {
    const result = a.prio - b.prio;

    if (result !== 0) {
      return result;
    }

    return b.path.length - a.path.length;
  });

  for (const child of trie.children) {
    sortTrie(child);
  }
}

export function printTrie(trie: RouteTrie, prefix = "TRIE: ") {
  logger.info(prefix, `[${trie.prio}]`, trie.path);
  for (const child of trie.children) {
    printTrie(child, prefix + "  ");
  }
}

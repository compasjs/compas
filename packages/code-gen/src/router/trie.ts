import { logger } from "../logger";
import { Route, RoutePrio, RouteTrie } from "../types";

export function constructTrieFromRouteList(routes: Route[]): RouteTrie {
  const trie: RouteTrie = createNode("", undefined);
  addHttpMethods(trie);

  for (const route of routes) {
    addRoute(trie, [route.method, ...route.path.split("/")], route);
  }

  sortTrie(trie);
  cleanTrieFromUnusedHttpMethods(trie);

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

function cleanTrieFromUnusedHttpMethods(trie: RouteTrie) {
  trie.children = trie.children.filter(it => it.children.length > 0);
}

function sortTrie(trie: RouteTrie) {
  trie.children = trie.children.sort((a, b) => a.prio - b.prio);
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

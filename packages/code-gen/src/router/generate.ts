import { Route } from "../types";
import { constructTrieFromRouteList, printTrie } from "./trie";

export function generateRouterStringFromRoutes(routes: Route[]): string {
  formatPaths(routes);
  const routeTrie = constructTrieFromRouteList(routes);
  printTrie(routeTrie);

  console.dir(routeTrie, {
    colors: true,
    depth: 1,
  });

  return "";
}

export function formatPaths(routes: Route[]) {
  for (const route of routes) {
    if (route.path.startsWith("/")) {
      route.path = route.path.substring(1);
    }
    if (route.path.endsWith("/")) {
      route.path = route.path.substring(0, route.path.length - 2);
    }
  }
}

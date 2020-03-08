const RoutePrio = {
  STATIC: 0,
  PARAM: 1,
  WILDCARD: 2,
};

export const buildTrie = routes => {
  const routeTrieInput = [];

  for (const r of routes) {
    routeTrieInput.push({
      routeName: r.name,
      fullPath: `${r.method}/${r.path}`,
    });
  }

  return buildRouteTrie(routeTrieInput);
};

function buildRouteTrie(input) {
  const trie = createNode("", undefined);
  addHttpMethods(trie);

  for (const r of input) {
    addRoute(
      trie,
      r.fullPath.split("/").filter(it => it.trim() !== ""),
      r.routeName,
    );
  }

  // Don't collapse top level
  for (const child of trie.children) {
    cleanTrieAndCollapse(child);
  }

  // Remove unneeded 'HTTP-method' children
  trie.children = trie.children.filter(
    it => it.children.length > 0 || it.routeName !== undefined,
  );

  sortTrie(trie);

  const ctx = {
    counter: 0,
  };
  return convertToGeneratorTrie(trie, ctx);
}

function convertToGeneratorTrie(trie, ctx) {
  let result = {
    routeName: trie.routeName || undefined,
    functionName: `routeMatcher${ctx.counter++}`,
    children: trie.children.map(it => convertToGeneratorTrie(it, ctx)),
  };

  if (trie.prio === RoutePrio.STATIC) {
    result.prio = "STATIC";
    result.staticPath = trie.path;
  } else if (trie.prio === RoutePrio.PARAM) {
    result.prio = "PARAM";
    result.paramName = trie.path.substring(1);
  } else if (trie.prio === RoutePrio.WILDCARD) {
    result.prio = "WILDCARD";
  }

  return result;
}

/**
 *
 * @param {string} path
 * @param {string=} [routeName]
 */
function createNode(path, routeName) {
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
    routeName,
    parent: undefined,
  };
}

function addChildNodes(parent, ...children) {
  for (const child of children) {
    child.parent = parent;
    parent.children.push(child);
  }
}

function addHttpMethods(trie) {
  addChildNodes(
    trie,
    createNode("GET"),
    createNode("POST"),
    createNode("PUT"),
    createNode("DELETE"),
    createNode("HEAD"),
  );
}

function addRoute(trie, path, routeName) {
  const currentPath = path[0];

  let child = trie.children.find(it => it.path === currentPath);
  if (!child) {
    child = createNode(currentPath, undefined);
    if (trie.prio === RoutePrio.WILDCARD) {
      throw new Error("Can't have sub routes on wildcard routes");
    }
    addChildNodes(trie, child);
  }

  if (path.length === 1) {
    child.routeName = routeName;
  } else {
    addRoute(child, path.slice(1), routeName);
  }
}

function cleanTrieAndCollapse(trie) {
  // Remove nodes without routeName & without children
  trie.children = trie.children.filter(
    it => it.routeName !== undefined || it.children.length > 0,
  );

  for (const child of trie.children) {
    cleanTrieAndCollapse(child);
  }

  if (trie.children.length > 0) {
    collapseStaticChildren(trie);
  }
}

function collapseStaticChildren(trie) {
  if (trie.routeName !== undefined || trie.parent === undefined) {
    return;
  }

  for (const child of trie.children) {
    if (child.prio !== RoutePrio.STATIC || trie.prio !== RoutePrio.STATIC) {
      return;
    }
  }

  const parent = trie.parent;
  const path = trie.path;

  // delete latest reference
  parent.children = parent.children.filter(it => it !== trie);
  trie.parent = undefined;

  for (const child of trie.children) {
    child.path = `${path}/${child.path}`;
    addChildNodes(parent, child);
  }
}

function sortTrie(trie) {
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

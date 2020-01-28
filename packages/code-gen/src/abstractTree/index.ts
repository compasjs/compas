import { AppSchema } from "../fluent/types";
import { AbstractRoute, AbstractRouteTrie, AbstractTree } from "../types";
import { extractRouteTrie } from "./router";
import { validateSchema } from "./schema";
import { extractTypes } from "./types";
import { extractValidators } from "./validators";

export function buildAbstractTree(schema: AppSchema): AbstractTree {
  validateSchema(schema);

  // Main items
  const types = extractTypes(schema);
  const router = extractRouteTrie(schema);
  const validators = extractValidators(schema);

  // Utils
  const abstractRoutes: AbstractRoute[] = [];
  getAbstractRoutes(router, abstractRoutes);

  return {
    types,
    router,
    abstractRoutes,
    validators,
  };
}

function getAbstractRoutes(trie: AbstractRouteTrie, result: AbstractRoute[]) {
  if (trie.handler) {
    result.push(trie.handler);
  }

  for (const child of trie.children) {
    getAbstractRoutes(child, result);
  }
}

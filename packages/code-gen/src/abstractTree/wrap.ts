import {
  AbstractTree,
  ModelTypeMap,
  TypeMap,
  WrappedAbstractTree,
} from "../types";
import { buildRouteTrie, printAbstractRouteTrie } from "./router";
import { validateTree } from "./validate";

export function wrapAbstractTree(tree: AbstractTree): WrappedAbstractTree {
  validateTree(tree);

  const routeTrie = buildRouteTrie(tree.abstractRoutes);
  printAbstractRouteTrie(routeTrie);

  const models = extractModels(tree.types);
  const validators = extractValidators(tree.types);

  console.dir(tree.types, {
    colors: true,
    depth: null,
  });

  return {
    ...tree,
    routeTrie,
    models,
    validators,
  };
}

function extractModels(map: TypeMap): ModelTypeMap {
  const result: ModelTypeMap = {};

  for (const key in map) {
    if (!Object.prototype.hasOwnProperty.call(map, key)) {
      continue;
    }

    if (map[key].withModel) {
      const type = map[key];
      if (type.type !== "object") {
        throw new Error(`${key} should be an object, to be used as a model`);
      }
      result[key] = type;
    }
  }

  return result;
}

function extractValidators(map: TypeMap): TypeMap {
  const result: TypeMap = {};

  for (const key in map) {
    if (!Object.prototype.hasOwnProperty.call(map, key)) {
      continue;
    }
    if (map[key].withValidator) {
      result[key] = map[key];
    }
  }

  return result;
}

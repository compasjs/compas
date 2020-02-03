import { isNil } from "@lbu/stdlib";
import { AbstractTree, TypeUnion } from "../types";
import { upperCaseFirst } from "../util";

export function validateTree(tree: AbstractTree) {
  const originalTypes = tree.types;
  tree.types = {};

  for (const [, v] of Object.entries(originalTypes)) {
    v.name = upperCaseFirst(v.name);
    tree.types[v.name] = v;
  }

  for (const t of Object.values(tree.types)) {
    validateType(tree, t);
  }
}

function validateType(tree: AbstractTree, t: TypeUnion) {
  switch (t.type) {
    case "object":
      for (const v of Object.values(t.keys)) {
        validateType(tree, v);
      }
      break;
    case "array":
      validateType(tree, t.values);
      break;
    case "anyOf":
      for (const v of t.anyOf) {
        validateType(tree, v);
      }
      break;
    case "reference":
      t.reference = upperCaseFirst(t.reference);
      if (isNil(tree.types[t.reference])) {
        throw new Error(`Unexpected reference: ${t.reference}`);
      }
      break;
  }
}

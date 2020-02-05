import { isNil } from "@lbu/stdlib";
import {
  AbstractTree,
  ArrayType,
  NumberType,
  StringType,
  TypeUnion,
} from "../types";
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
    case "number":
      validateModelReference(tree, t);
      break;
    case "string":
      validateModelReference(tree, t);
      break;
    case "object":
      for (const v of Object.values(t.keys)) {
        validateType(tree, v);
      }
      break;
    case "array":
      validateType(tree, t.values);
      validateModelReference(tree, t);
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

function validateModelReference(
  tree: AbstractTree,
  t: StringType | NumberType | ArrayType,
) {
  if (t.model.reference) {
    const referenced = tree.types[t.model.reference.modelName];
    if (referenced.type !== "object") {
      throw new Error(
        `${t.model.reference.modelName} is referenced, but not an object`,
      );
    }

    const field = referenced.keys[t.model.reference.fieldName];
    if (!field) {
      throw new Error(
        `${t.model.reference.modelName}.${t.model.reference.fieldName} is referenced, but does not exist`,
      );
    }

    if (
      field.type !== "number" &&
      field.type !== "string" &&
      field.type !== "array"
    ) {
      throw new Error(
        `${t.model.reference.modelName}.${t.model.reference.fieldName} is referenced, but is not a string or number`,
      );
    }

    if (t.type === "array" && field.type === "array") {
      throw new Error(
        `${t.model.reference!.modelName}.${
          t.model.reference!.fieldName
        } is referenced, but an array can't reference another array`,
      );
    }
  }
}

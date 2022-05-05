import { AppError } from "@compas/stdlib";

export function preprocessPick(structure, type) {
  if (type.type !== "pick") {
    return type;
  }

  const reference =
    type.reference.type === "reference"
      ? type.reference.reference
      : type.reference;

  if (reference.type !== "object") {
    throw AppError.serverError({
      message: `Pick should reference an object or a reference to an 'object', found '${reference.type}'.`,
    });
  }

  const pickedKeys = type.keys;

  type.type = "object";
  type.keys = {};

  delete type.reference;
  type.enableQueries = false;
  type.relations = [];

  for (const key of pickedKeys) {
    type.keys[key] = reference.keys[key];
  }

  return type;
}

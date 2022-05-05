import { AppError } from "@compas/stdlib";

export function preprocessOmit(structure, type) {
  if (type.type !== "omit") {
    return type;
  }

  const reference =
    type.reference.type === "reference"
      ? type.reference.reference
      : type.reference;

  if (reference.type !== "object") {
    throw AppError.serverError({
      message: `Omit should reference an object or a reference to an 'object', found '${reference.type}'.`,
    });
  }

  const removedKeys = type.keys;

  type.type = "object";
  type.keys = {
    ...reference.keys,
  };

  delete type.reference;
  type.enableQueries = false;
  type.relations = [];

  for (const key of removedKeys) {
    delete type.keys[key];
  }

  return type;
}

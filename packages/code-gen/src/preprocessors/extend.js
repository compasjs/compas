import { AppError } from "@compas/stdlib";

export function preprocessExtend(structure, type) {
  if (type.type !== "extend") {
    return;
  }

  if (type.reference.reference.type !== "object") {
    throw AppError.serverError({
      message: `Can't call 'T.extend()' on a non 'object' reference. Found '${type.reference.reference.type}' (${type.reference.reference.uniqueName}).`,
    });
  }

  type.reference.reference.keys = Object.assign(
    type.reference.reference.keys,
    type.keys,
  );
  type.reference.reference.relations.push(...type.relations);

  delete structure[type.group][type.name];
}

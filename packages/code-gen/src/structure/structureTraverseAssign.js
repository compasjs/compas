import { structureNamedTypes } from "./structureNamedTypes.js";

/**
 * @typedef {object} TraverseMetadata
 * @property {boolean} isNamedType
 */

/**
 * Traverses the structure bottom up, calling callback for each type and assigning it
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 * @param {(type: import("../generated/common/types.js").CodeGenType|
 *   import("../generated/common/types.js").CodeGenRelationType|
 *   import("../generated/common/types.js").CodeGenRouteInvalidationType, metadata:
 *   TraverseMetadata) => any} callback
 */
export function structureTraverserAssign(structure, callback) {
  for (const type of structureNamedTypes(structure)) {
    // @ts-expect-error
    structure[type.group][type.name] = traverseAssignProcess(
      structure,
      callback,
      type,
      {
        isNamedType: true,
      },
    );
  }
}

function traverseAssignProcess(structure, callback, type, metadata) {
  if (!type || !type.type) {
    return type;
  }

  metadata = metadata ?? {};
  metadata.isNamedType = metadata.isNamedType ?? false;

  switch (type.type) {
    case "any":
    case "boolean":
    case "date":
    case "file":
    case "number":
    case "reference":
    case "routeInvalidation":
    case "string":
    case "uuid":
      return callback(type, metadata);

    case "anyOf":
      for (let i = 0; i < type.values.length; ++i) {
        type.values[i] = traverseAssignProcess(
          structure,
          callback,
          type.values[i],
        );
      }
      return callback(type, metadata);

    case "array":
      type.values = traverseAssignProcess(structure, callback, type.values);
      return callback(type, metadata);

    case "generic":
      type.keys = traverseAssignProcess(structure, callback, type.keys);
      type.values = traverseAssignProcess(structure, callback, type.values);
      return callback(type, metadata);

    case "object":
      for (const key of Object.keys(type.keys)) {
        type.keys[key] = traverseAssignProcess(
          structure,
          callback,
          type.keys[key],
        );
      }
      return callback(type, metadata);

    case "omit":
    case "pick":
      type.reference = traverseAssignProcess(
        structure,
        callback,
        type.reference,
      );
      return callback(type, metadata);

    case "relation":
      type.reference = traverseAssignProcess(
        structure,
        callback,
        type.reference,
      );
      return callback(type, metadata);

    case "route":
      type.params = traverseAssignProcess(structure, callback, type.params);
      type.query = traverseAssignProcess(structure, callback, type.query);
      type.body = traverseAssignProcess(structure, callback, type.body);
      type.files = traverseAssignProcess(structure, callback, type.files);
      type.response = traverseAssignProcess(structure, callback, type.response);

      return callback(type, metadata);
  }
}

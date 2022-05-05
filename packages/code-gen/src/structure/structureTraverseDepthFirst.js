import { structureNamedTypes } from "./structureNamedTypes.js";

/**
 * Traverse the structure depth first, executing the callback for each type.
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structureOrType
 * @param {(type: import("./types.js").CodeGenStructureType, metadata:
 *  import("./types.js").TraverseMetadata) => any} callback
 */
export function structureTraverseDepthFirst(structureOrType, callback) {
  for (const type of structureNamedTypes(structureOrType)) {
    traverseDepthFirstProcess(structureOrType, callback, type, {
      isNamedType: true,
    });
  }
}

function traverseDepthFirstProcess(structure, callback, type, metadata) {
  if (!type || !type.type) {
    return;
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
      callback(type, metadata);
      break;

    case "anyOf":
      for (let i = 0; i < type.values.length; ++i) {
        traverseDepthFirstProcess(structure, callback, type.values[i]);
      }
      callback(type, metadata);
      break;

    case "array":
      traverseDepthFirstProcess(structure, callback, type.values);
      callback(type, metadata);
      break;

    case "generic":
      traverseDepthFirstProcess(structure, callback, type.keys);
      traverseDepthFirstProcess(structure, callback, type.values);
      callback(type, metadata);
      break;

    case "object":
      for (const key of Object.keys(type.keys)) {
        traverseDepthFirstProcess(structure, callback, type.keys[key]);
      }

      for (let i = 0; i < type.relations.length; ++i) {
        traverseDepthFirstProcess(structure, callback, type.relations[i]);
      }

      callback(type, metadata);
      break;

    case "omit":
    case "pick":
      traverseDepthFirstProcess(structure, callback, type.reference);
      callback(type, metadata);
      break;

    case "relation":
      traverseDepthFirstProcess(structure, callback, type.reference);
      callback(type, metadata);
      break;

    case "route":
      traverseDepthFirstProcess(structure, callback, type.params);
      traverseDepthFirstProcess(structure, callback, type.query);
      traverseDepthFirstProcess(structure, callback, type.body);
      traverseDepthFirstProcess(structure, callback, type.files);
      traverseDepthFirstProcess(structure, callback, type.response);

      callback(type, metadata);
      break;
  }
}

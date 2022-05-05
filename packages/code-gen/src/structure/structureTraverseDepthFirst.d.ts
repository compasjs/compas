/**
 * Traverse the structure depth first, executing the callback for each type.
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structureOrType
 * @param {(type: import("./types.js").CodeGenStructureType, metadata:
 *  import("./types.js").TraverseMetadata) => any} callback
 */
export function structureTraverseDepthFirst(
  structureOrType: import("../generated/common/types.js").CodeGenStructure,
  callback: (
    type: import("./types.js").CodeGenStructureType,
    metadata: import("./types.js").TraverseMetadata,
  ) => any,
): void;
//# sourceMappingURL=structureTraverseDepthFirst.d.ts.map

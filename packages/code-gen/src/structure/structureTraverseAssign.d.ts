/**
 * Traverses the structure bottom up, calling callback for each type and assigning it
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 * @param {(type: import("./types.js").CodeGenStructureType, metadata:
 *   import("./types.js").TraverseMetadata) => any} callback
 */
export function structureTraverserAssign(
  structure: import("../generated/common/types.js").CodeGenStructure,
  callback: (
    type: import("./types.js").CodeGenStructureType,
    metadata: import("./types.js").TraverseMetadata,
  ) => any,
): void;
//# sourceMappingURL=structureTraverseAssign.d.ts.map

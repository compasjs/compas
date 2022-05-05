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
export function structureTraverserAssign(
  structure: import("../generated/common/types.js").CodeGenStructure,
  callback: (
    type:
      | import("../generated/common/types.js").CodeGenType
      | import("../generated/common/types.js").CodeGenRelationType
      | import("../generated/common/types.js").CodeGenRouteInvalidationType,
    metadata: TraverseMetadata,
  ) => any,
): void;
export type TraverseMetadata = {
  isNamedType: boolean;
};
//# sourceMappingURL=structureTraverseAssign.d.ts.map

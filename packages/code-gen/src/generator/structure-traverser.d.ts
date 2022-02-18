/**
 * Traverse the structure, calling the callback for each unique type. Can only be used
 * after 'linkupReferencesInStructure'.
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 * @param {(type: import("../generated/common/types.js").CodeGenType) => void} callback
 */
export function traverseStructure(
  structure: import("../generated/common/types.js").CodeGenStructure,
  callback: (type: import("../generated/common/types.js").CodeGenType) => void,
): void;
/**
 * Traverse the structure, calling the callback for each unique type. Can only be used
 * after 'linkupReferencesInStructure'.
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 * @param {import("../generated/common/types.js").CodeGenType} type
 * @param {(type: import("../generated/common/types.js").CodeGenType) => void} callback
 */
export function traverseType(
  structure: import("../generated/common/types.js").CodeGenStructure,
  type: import("../generated/common/types.js").CodeGenType,
  callback: (type: import("../generated/common/types.js").CodeGenType) => void,
): void;
//# sourceMappingURL=structure-traverser.d.ts.map

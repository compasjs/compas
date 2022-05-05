/**
 * Returns an array of all known named types
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 * @returns {import("../generated/common/types.js").CodeGenType[]}
 */
export function structureNamedTypes(structure) {
  const result = [];

  for (const group of Object.values(structure)) {
    for (const type of Object.values(group)) {
      result.push(type);
    }
  }

  return result;
}

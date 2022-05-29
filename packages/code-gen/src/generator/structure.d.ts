/**
 * Create a structure file with at least the generate options that are used.
 * If 'dumpStructure' is true, dump the structure before any generator added types or
 * something.
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function structureCreateFile(
  context: import("../generated/common/types").CodeGenContext,
): void;
/**
 * Append the final api structure to the 'structure' source if 'dumpApiStructure' is
 * true.
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function structureAppendApiStructure(
  context: import("../generated/common/types").CodeGenContext,
): void;
//# sourceMappingURL=structure.d.ts.map

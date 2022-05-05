/**
 * Provided that input is empty, copy over all enabled groups from structure,
 * automatically include references of groups that are not enabled.
 *
 * @param {CodeGenStructure} input
 * @param {CodeGenStructure} structure
 * @param {string[]} groups
 */
export function addGroupsToGeneratorInput(
  input: CodeGenStructure,
  structure: CodeGenStructure,
  groups: string[],
): void;
/**
 * Find nested references and add to generatorInput in the correct group
 *
 * @param {CodeGenStructure} structure
 * @param {CodeGenStructure} input
 * @returns {void}
 */
export function includeReferenceTypes(
  structure: CodeGenStructure,
  input: CodeGenStructure,
): void;
/**
 * Using some more memory, but ensures a mostly consistent output.
 * JS Object iterators mostly follow insert order.
 * We do this so diffs are more logical
 *
 * @param {CodeGenStructure} input
 * @param {CodeGenStructure} copy
 */
export function copyAndSort(
  input: CodeGenStructure,
  copy: CodeGenStructure,
): void;
//# sourceMappingURL=generate.d.ts.map

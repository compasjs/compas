/**
 * Provided that input is empty
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
/**
 * Add item to correct group and add uniqueName
 *
 * @param {CodeGenStructure} dataStructure
 * @param {CodeGenType} item
 */
export function addToData(
  dataStructure: CodeGenStructure,
  item: CodeGenType,
): void;
/**
 * @param root
 * @param structure
 */
export function hoistNamedItems(root: any, structure: any): void;
//# sourceMappingURL=generate.d.ts.map

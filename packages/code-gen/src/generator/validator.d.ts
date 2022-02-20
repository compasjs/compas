/**
 * @typedef {object} ValidatorContext
 * @property {import("../generated/common/types").CodeGenContext} context
 * @property {Map<string, number>} anonymousFunctionMapping
 * @property {string[]} anonymousFunctions
 * @property {Map<string, string>} objectSets
 */
/**
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function generateValidatorFile(
  context: import("../generated/common/types").CodeGenContext,
): void;
export type ValidatorContext = {
  context: import("../generated/common/types").CodeGenContext;
  anonymousFunctionMapping: Map<string, number>;
  anonymousFunctions: string[];
  objectSets: Map<string, string>;
};
//# sourceMappingURL=validator.d.ts.map

/**
 * @typedef {import("./utils").ImportCreator} ImportCreator
 */
/**
 * @typedef {object} ValidatorContext
 * @property {CodeGenContext} context
 * @property {Map<string, number>} anonymousFunctionMapping
 * @property {string[]} anonymousFunctions
 * @property {Map<string, string>} objectSets
 */
/**
 * @param {CodeGenContext} context
 */
export function generateValidatorFile(context: CodeGenContext): void;
export type ImportCreator = import("./utils").ImportCreator;
export type ValidatorContext = {
  context: CodeGenContext;
  anonymousFunctionMapping: Map<string, number>;
  anonymousFunctions: string[];
  objectSets: Map<string, string>;
};
//# sourceMappingURL=validator.d.ts.map

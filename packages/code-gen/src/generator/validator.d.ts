/**
 * @param {CodeGenContext} context
 */
export function generateValidatorFile(context: CodeGenContext): void;
export type ImportCreator = import("./utils").ImportCreator;
export type ValidatorContext = {
  context: CodeGenContext;
  collectErrors: boolean;
  anonymousFunctionMapping: Map<string, number>;
  anonymousFunctions: string[];
  objectSets: Map<string, string>;
};
/**
 * Calls generated buildError function to construct an error
 */
export type GeneratorBuildError = (
  key: string,
  info: string,
  errors?: string | undefined,
  errorsReturn?: boolean | undefined,
) => string;
//# sourceMappingURL=validator.d.ts.map

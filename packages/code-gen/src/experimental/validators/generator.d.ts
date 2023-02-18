/**
 * @typedef {{ type: "root"}
 *   |{ type: "stringKey", key: string}
 *   |{ type: "dynamicKey", key: string }
 * } ValidatorPath
 */
/**
 * @typedef {object} ValidatorState
 *
 * @property {import("../generate").GenerateContext} generateContext
 * @property {string} inputVariableName
 * @property {string} outputVariableName
 * @property {string} errorMapVariableName
 * @property {string} inputTypeName
 * @property {string} outputTypeName
 * @property {import("../types/generator").GenerateTypeOptions} outputTypeOptions
 * @property {number} reusedVariableIndex
 * @property {ValidatorPath[]} validatedValuePath
 * @property {import("../generated/common/types")
 * .ExperimentalReferenceDefinition[]
 * } dependingValidators
 * @property {boolean} [jsHasInlineTypes]
 */
/**
 * Generate all the 'validated' types in the provided structure. This means that, for
 * example, `defaults` are resolved, and things like `T.date()` are always in the
 * language native `Date` type.
 *
 * We skip `route` ad `crud` since these are not directly usable as types.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function validatorGeneratorGenerateBaseTypes(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Provides the validator function name and adds the import to the provided file for the
 * type.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {string} outputTypeName
 * @returns {string}
 */
export function validatorGetNameAndImport(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  type: import("../types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  outputTypeName: string,
): string;
/**
 * Generate a named type for the target language. Skips if the cache already has a name
 * registered for the provided type and options.
 *
 * TODO: Expand docs
 *
 * - How to use the types
 * - Duplication
 * - Resolved & unique names
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {import("../types/generator").GenerateTypeOptions & {
 *   preferInputBaseName?: boolean;
 * }} outputTypeOptions
 */
export function validatorGeneratorGenerateValidator(
  generateContext: import("../generate").GenerateContext,
  type: import("../types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  outputTypeOptions: import("../types/generator").GenerateTypeOptions & {
    preferInputBaseName?: boolean;
  },
): void;
/**
 * Generate the body of a validator. This function should be called and work for
 * recursive types as well.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
export function validatorGeneratorGenerateBody(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  type: import("../types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  validatorState: ValidatorState,
): void;
export type ValidatorPath =
  | {
      type: "root";
    }
  | {
      type: "stringKey";
      key: string;
    }
  | {
      type: "dynamicKey";
      key: string;
    };
export type ValidatorState = {
  generateContext: import("../generate").GenerateContext;
  inputVariableName: string;
  outputVariableName: string;
  errorMapVariableName: string;
  inputTypeName: string;
  outputTypeName: string;
  outputTypeOptions: import("../types/generator").GenerateTypeOptions;
  reusedVariableIndex: number;
  validatedValuePath: ValidatorPath[];
  dependingValidators: import("../generated/common/types").ExperimentalReferenceDefinition[];
  jsHasInlineTypes?: boolean | undefined;
};
//# sourceMappingURL=generator.d.ts.map

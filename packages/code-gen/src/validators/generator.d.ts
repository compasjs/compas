/**
 * @typedef {{ type: "root"}
 *   |{ type: "stringKey", key: string}
 *   |{ type: "dynamicKey", key: string }
 * } ValidatorPath
 */
/**
 * @typedef {object} ValidatorState
 * @property {import("../generate.js").GenerateContext} generateContext
 * @property {string} inputVariableName
 * @property {string} outputVariableName
 * @property {string} errorMapVariableName
 * @property {string} inputTypeName
 * @property {string} outputTypeName
 * @property {import("../types/generator.js").GenerateTypeOptions} outputTypeOptions
 * @property {number} reusedVariableIndex
 * @property {ValidatorPath[]} validatedValuePath
 * @property {import("../generated/common/types.js")
 * .ExperimentalReferenceDefinition[]
 * } dependingValidators
 * @property {boolean} [jsHasInlineTypes]
 * @property {boolean} [skipFirstNilCheck]
 */
/**
 * Generate all the 'validated' types in the provided structure. This means that, for
 * example, `defaults` are resolved, and things like `T.date()` are always in the
 * language native `Date` type.
 *
 * We skip `route` ad `crud` since these are not directly usable as types.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function validatorGeneratorGenerateBaseTypes(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Provides the validator function name and adds the import to the provided file for the
 * type.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {string} outputTypeName
 * @returns {string}
 */
export function validatorGetNameAndImport(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  type: import("../../types/advanced-types").NamedType<
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
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {import("../types/generator.js").GenerateTypeOptions & {
 *   preferInputBaseName?: boolean;
 * }} outputTypeOptions
 */
export function validatorGeneratorGenerateValidator(
  generateContext: import("../generate.js").GenerateContext,
  type: import("../../types/advanced-types").NamedType<
    import("../generated/common/types").ExperimentalTypeSystemDefinition
  >,
  outputTypeOptions: import("../types/generator.js").GenerateTypeOptions & {
    preferInputBaseName?: boolean;
  },
): void;
/**
 * Generate the body of a validator. This function should be called and work for
 * recursive types as well.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
export function validatorGeneratorGenerateBody(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  type: import("../../types/advanced-types").NamedType<
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
  generateContext: import("../generate.js").GenerateContext;
  inputVariableName: string;
  outputVariableName: string;
  errorMapVariableName: string;
  inputTypeName: string;
  outputTypeName: string;
  outputTypeOptions: import("../types/generator.js").GenerateTypeOptions;
  reusedVariableIndex: number;
  validatedValuePath: ValidatorPath[];
  dependingValidators: import("../generated/common/types.js").ExperimentalReferenceDefinition[];
  jsHasInlineTypes?: boolean | undefined;
  skipFirstNilCheck?: boolean | undefined;
};
//# sourceMappingURL=generator.d.ts.map

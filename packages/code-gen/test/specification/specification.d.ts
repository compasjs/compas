/**
 * @typedef {object} CodeGenSpecificationSuite
 * @property {"suite"} type
 * @property {string} name
 * @property {CodeGenSpecification[]} components
 */
/**
 * @typedef {object} CodeGenSpecificationGenerate
 * @property {"generate"} type
 * @property {string} structureDirectory
 */
/**
 * @typedef {object} CodeGenSpecificationValidator
 * @property {"validator"} type
 * @property {{ group: string, name: string }} generatedType
 * @property {string} [input]
 * @property {{
 *   key: string,
 *   errorKey: string,
 * }} [assertValidatorError]
 */
/**
 * @typedef {CodeGenSpecificationSuite
 *   |CodeGenSpecificationGenerate
 *   |CodeGenSpecificationValidator
 * } CodeGenSpecification
 */
/**
 * @type {CodeGenSpecification}
 */
export const codeGenSpecification: CodeGenSpecification;
export type CodeGenSpecificationSuite = {
  type: "suite";
  name: string;
  components: CodeGenSpecification[];
};
export type CodeGenSpecificationGenerate = {
  type: "generate";
  structureDirectory: string;
};
export type CodeGenSpecificationValidator = {
  type: "validator";
  generatedType: {
    group: string;
    name: string;
  };
  input?: string | undefined;
  assertValidatorError?:
    | {
        key: string;
        errorKey: string;
      }
    | undefined;
};
export type CodeGenSpecification =
  | CodeGenSpecificationSuite
  | CodeGenSpecificationGenerate
  | CodeGenSpecificationValidator;
//# sourceMappingURL=specification.d.ts.map

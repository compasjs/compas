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
 * @typedef {object} CodeGenSpecificationRouteMatcher
 * @property {"routeMatcher"} type
 * @property {{
 *   method: string,
 *   path: string,
 * }} matchInput
 * @property {{
 *   route: {
 *     group: string,
 *     name: string,
 *   },
 *   params: Record<string, string>
 * }} [matchOutput]
 */
/**
 * @typedef {CodeGenSpecificationSuite
 *   |CodeGenSpecificationGenerate
 *   |CodeGenSpecificationValidator
 *   |CodeGenSpecificationRouteMatcher
 * } CodeGenSpecification
 */
/**
 * The full specification which can be used by implementations to check static behavior.
 *
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
export type CodeGenSpecificationRouteMatcher = {
  type: "routeMatcher";
  matchInput: {
    method: string;
    path: string;
  };
  matchOutput?:
    | {
        route: {
          group: string;
          name: string;
        };
        params: Record<string, string>;
      }
    | undefined;
};
export type CodeGenSpecification =
  | CodeGenSpecificationSuite
  | CodeGenSpecificationGenerate
  | CodeGenSpecificationValidator
  | CodeGenSpecificationRouteMatcher;
//# sourceMappingURL=specification.d.ts.map

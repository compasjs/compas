/**
 * @typedef {{
 *   model: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   whereType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   insertType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   updateType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   orderByType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   orderBySpecType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   queryBuilderType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   queryResultType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   }
 * }} DatabaseContextNames
 */
/**
 * Run the database generator.
 *
 * TODO: expand docs
 *
 * TODO: throw when TS is used with JS postgres
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function databaseGenerator(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Format the target to use.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {"jsPostgres"|"tsPostgres"}
 */
export function databaseFormatTarget(
  generateContext: import("../generate.js").GenerateContext,
): "jsPostgres" | "tsPostgres";
/**
 * Check if we should run the database generator.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function databaseIsEnabled(
  generateContext: import("../generate.js").GenerateContext,
):
  | {
      target: {
        dialect: "postgres";
        includeDDL: boolean;
      };
      includeEntityDiagram: boolean;
    }
  | undefined;
export type DatabaseContextNames = {
  model: {
    inputType: string;
    outputType: string;
    validatorFunction: string;
  };
  whereType: {
    inputType: string;
    outputType: string;
    validatorFunction: string;
  };
  insertType: {
    inputType: string;
    outputType: string;
    validatorFunction: string;
  };
  updateType: {
    inputType: string;
    outputType: string;
    validatorFunction: string;
  };
  orderByType: {
    inputType: string;
    outputType: string;
    validatorFunction: string;
  };
  orderBySpecType: {
    inputType: string;
    outputType: string;
    validatorFunction: string;
  };
  queryBuilderType: {
    inputType: string;
    outputType: string;
    validatorFunction: string;
  };
  queryResultType: {
    inputType: string;
    outputType: string;
    validatorFunction: string;
  };
};
//# sourceMappingURL=generator.d.ts.map

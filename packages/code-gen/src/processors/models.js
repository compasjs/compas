import { AnyType } from "../builders/index.js";
import { structureNamedTypes } from "./structure.js";

/**
 * Get a list of query enabled objects in the structure.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {(import("../types.js").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>)[]}
 */
export function structureModels(generateContext) {
  /**
   * @type {(import("../types.js").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>)[]}
   */
  const result = [];

  for (const namedType of structureNamedTypes(generateContext.structure)) {
    if (namedType.type === "object" && namedType.enableQueries) {
      result.push(namedType);
    }
  }

  return result;
}

/**
 * Return a new generic any type for custom query parts
 *
 * @returns {import("../builders/AnyType.js").AnyType}
 */
export function modelQueryPartType() {
  return new AnyType().implementations({
    jsPostgres: {
      validatorImport: `import { isQueryPart } from "@compas/store";`,
      validatorExpression: `isQueryPart($value$)`,
      validatorInputType: `(any|import("@compas/store").QueryPart<any>)`,
      validatorOutputType: `import("@compas/store").QueryPart<any>`,
    },
  });
}

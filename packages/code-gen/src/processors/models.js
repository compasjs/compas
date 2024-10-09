import { AnyType } from "../builders/index.js";
import { structureNamedTypes } from "./structure.js";

/**
 * Get a list of query enabled objects in the structure.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {Array<(import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>)>}
 */
export function structureModels(generateContext) {
  /**
   * @type {Array<(import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>)>}
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
      validatorInputType: `(import("@compas/store").QueryPart<any>)`,
      validatorOutputType: `import("@compas/store").QueryPart<any>`,
    },
    tsPostgres: {
      validatorImport: `import { isQueryPart } from "@compas/store";\nimport type { QueryPart } from "@compas/store";`,
      validatorExpression: `isQueryPart($value$)`,
      validatorInputType: `(QueryPart)`,
      validatorOutputType: `(QueryPart)`,
    },
  });
}

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
 * Let models ignore unknown top-level keys, so a migration that adds a column doesn't
 * break deploys still running the previous structure. Nested objects keep their own
 * strictness.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function modelLooseTopLevel(generateContext) {
  for (const model of structureModels(generateContext)) {
    model.validator.strict = false;
  }
}

/**
 * Return a new generic any type for custom query parts
 *
 * @returns {import("../builders/AnyType.js").AnyType}
 */
export function modelQueryPartType() {
  return new AnyType().implementations({
    js: {
      validatorImport: `import { isQueryPart } from "@compas/store";`,
      validatorExpression: `isQueryPart($value$)`,
      validatorInputType: `(import("@compas/store").QueryPart<any>)`,
      validatorOutputType: `import("@compas/store").QueryPart<any>`,
    },
    ts: {
      validatorImport: `import { isQueryPart } from "@compas/store";\nimport type { QueryPart } from "@compas/store";`,
      validatorExpression: `isQueryPart($value$)`,
      validatorInputType: `(import("@compas/store").QueryPart)`,
      validatorOutputType: `(import("@compas/store").QueryPart)`,
    },
  });
}

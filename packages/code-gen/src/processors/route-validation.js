import { AppError, isNil } from "@compas/stdlib";
import {
  errorsThrowCombinedError,
  stringFormatNameForError,
} from "../utils.js";
import { structureRoutes } from "./routes.js";
import { structureResolveReference } from "./structure.js";
import { typeDefinitionTraverse } from "./type-definition-traverse.js";

/**
 * Various route validation related things
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function routeValidation(generateContext) {
  /** @type {import("@compas/stdlib").AppError[]} */
  const errors = [];

  for (const route of structureRoutes(generateContext)) {
    try {
      routeValidationSimpleQueryAndParamTypes(generateContext, route, "params");
      routeValidationSimpleQueryAndParamTypes(generateContext, route, "query");
    } catch (/** @type {any} */ e) {
      errors.push(e);
    }
  }

  errorsThrowCombinedError(errors);
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureRouteDefinition>} route
 * @param {"query"|"params"} subType
 */
function routeValidationSimpleQueryAndParamTypes(
  generateContext,
  route,
  subType,
) {
  if (isNil(route[subType])) {
    return;
  }

  const resolvedType = structureResolveReference(
    generateContext.structure,

    // @ts-expect-error
    route[subType],
  );

  if (resolvedType.type !== "object") {
    throw AppError.serverError({
      message: `${stringFormatNameForError(route)} ${subType} is a '${
        resolvedType.type
      }'. Only 'T.object()' or a reference to an object is allowed.`,
    });
  }

  const allowedTypes = [
    "any",
    "anyOf",
    "boolean",
    "date",
    "number",
    "reference",
    "string",
    "uuid",
  ];

  for (const key of Object.keys(resolvedType.keys ?? {})) {
    routeValidationConformAllowedTypes(
      generateContext,
      route,
      resolvedType.keys[key],
      allowedTypes,
      new Set(),
    );
  }
}

/**
 * Recursively check if field only uses 'allowedTypes'.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureRouteDefinition>} route
 * @param {import("../generated/common/types.js").StructureTypeSystemDefinition} field
 * @param {string[]} allowedTypes
 * @param {Set<any>} handledRefs
 */
function routeValidationConformAllowedTypes(
  generateContext,
  route,
  field,
  allowedTypes,
  handledRefs,
) {
  typeDefinitionTraverse(
    field,
    (type) => {
      if (!allowedTypes.includes(type.type)) {
        throw AppError.serverError({
          message: `Found an invalid type '${
            type.type
          }' used in the params or query of ${stringFormatNameForError(route)}`,
        });
      }

      if (type.type === "reference") {
        const resolvedRef = structureResolveReference(
          generateContext.structure,
          type,
        );

        if (!handledRefs.has(resolvedRef)) {
          handledRefs.add(resolvedRef);

          routeValidationConformAllowedTypes(
            generateContext,
            route,

            // @ts-expect-error
            resolvedRef,
            allowedTypes,
            handledRefs,
          );
        }
      }
    },
    {
      isInitialType: true,
    },
  );
}

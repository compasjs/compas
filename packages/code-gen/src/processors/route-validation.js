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

      routeValidationBodyWithFiles(generateContext, route);
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
      `used in the ${subType} of`,
      allowedTypes,
      new Set(),
    );
  }
}

/**
 * Check that when files are used with other fields, that they are simple types. We don't
 * define behavior for parsing complex types out of multipart/form-data.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureRouteDefinition>} route
 */
function routeValidationBodyWithFiles(generateContext, route) {
  if (isNil(route.body)) {
    return;
  }

  const resolvedType = structureResolveReference(
    generateContext.structure,
    route.body,
  );

  if (resolvedType.type !== "object") {
    return;
  }

  const hasFiles = routeValidationReferencesFiles(
    generateContext,
    resolvedType,
    new Set(),
  );

  if (!hasFiles) {
    return;
  }

  const allowedTypes = [
    "any",
    "anyOf",
    "boolean",
    "date",
    "file",
    "number",
    "reference",
    "string",
    "uuid",
  ];

  route.metadata ??= {};
  route.metadata.requestBodyType = "form-data";

  for (const key of Object.keys(resolvedType.keys ?? {})) {
    routeValidationConformAllowedTypes(
      generateContext,
      route,
      resolvedType.keys[key],
      "used in the body of",
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
 * @param {string} partialError
 * @param {string[]} allowedTypes
 * @param {Set<any>} handledRefs
 */
function routeValidationConformAllowedTypes(
  generateContext,
  route,
  field,
  partialError,
  allowedTypes,
  handledRefs,
) {
  typeDefinitionTraverse(
    field,
    (type, callback) => {
      if (!allowedTypes.includes(type.type)) {
        throw AppError.serverError({
          message: `Found an invalid type '${
            type.type
          }' ${partialError} ${stringFormatNameForError(route)}`,
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
            partialError,
            allowedTypes,
            handledRefs,
          );
        }
      }

      callback(type);
    },
    {
      isInitialType: true,
    },
  );
}

/**
 * Recursively check if field is using a 'file' type.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureTypeSystemDefinition} field
 * @param {Set<any>} handledRefs
 * @returns {boolean}
 */
function routeValidationReferencesFiles(generateContext, field, handledRefs) {
  let hasFilesType = false;

  typeDefinitionTraverse(
    field,
    (type, callback) => {
      hasFilesType ||= type.type === "file";

      if (type.type === "reference") {
        const resolvedRef = structureResolveReference(
          generateContext.structure,
          type,
        );

        if (!handledRefs.has(resolvedRef)) {
          handledRefs.add(resolvedRef);

          hasFilesType ||= routeValidationReferencesFiles(
            generateContext,

            // @ts-expect-error
            resolvedRef,
            handledRefs,
          );
        }
      }

      callback(type);
    },
    {
      isInitialType: true,
    },
  );

  return hasFilesType;
}

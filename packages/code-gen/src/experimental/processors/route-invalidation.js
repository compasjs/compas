import { AppError, isNil } from "@compas/stdlib";
import { errorsThrowCombinedError } from "../errors.js";
import { stringFormatNameForError } from "../string-format.js";
import { structureRoutes } from "./routes.js";
import { structureResolveReference } from "./structure.js";

/**
 * Check if all route invalidations are correct.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function routeInvalidationsCheck(generateContext) {
  /** @type {import("@compas/stdlib").AppError[]} */
  const errors = [];

  for (const route of structureRoutes(generateContext)) {
    if (route.invalidations.length === 0) {
      continue;
    }

    try {
      for (const invalidation of route.invalidations) {
        routeInvalidationProcess(generateContext, route, invalidation);
      }
    } catch (/** @type {any} */ e) {
      errors.push(e);
    }
  }

  errorsThrowCombinedError(errors);
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {(import("../types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>)[]} route
 * @param {import("../generated/common/types").ExperimentalRouteInvalidationDefinition} invalidation
 */
function routeInvalidationProcess(generateContext, route, invalidation) {
  const targetGroup = generateContext.structure[invalidation.target.group];

  if (isNil(targetGroup)) {
    throw AppError.serverError({
      message: `Invalidation from ${stringFormatNameForError(
        route,
      )} specifies an invalid target ${formatTarget(
        invalidation.target,
      )}. Valid targets are 'R.get()' and 'R.post().idempotent()' routes.`,
    });
  }

  if (isNil(invalidation.target.name)) {
    // The group is valid, which will automatically invalide all 'get' / idempotent
    // routes that are available.
    return;
  }

  /** @type {import("../generated/common/types").ExperimentalRouteDefinition} */
  // @ts-expect-error
  const targetRoute = targetGroup?.[invalidation.target.name];

  if (
    isNil(targetRoute) ||
    targetRoute.type !== "route" ||
    (targetRoute.method !== "GET" &&
      !(targetRoute.method === "POST" && targetRoute.idempotent))
  ) {
    throw AppError.serverError({
      message: `Invalidation from ${stringFormatNameForError(
        route,
      )} specificies invalid target ${targetRoute}. Valid targets are 'R.get()' and 'R.post().idempotent()' routes.`,
    });
  }

  // The logic for shared params and query is the same, so we can simplify the logic
  // below to operate the same way, regardless of params or query.
  const sharedKeys = [];
  if (invalidation.properties.useSharedParams) {
    sharedKeys.push("params");
  }
  if (invalidation.properties.useSharedQuery) {
    sharedKeys.push("query");
  }

  for (const specificationKey of sharedKeys) {
    if (
      isNil(route[specificationKey]) ||
      isNil(targetRoute[specificationKey])
    ) {
      // Either the currrent route or the target route doesn't have query / params, so
      // nothing is shared.
      continue;
    }

    const routeObject =
      structureResolveReference(
        generateContext.structure,
        route[specificationKey],
      )?.keys ?? {};
    const targetRouteObject =
      structureResolveReference(
        generateContext.structure,
        targetRoute[specificationKey],
      )?.keys ?? {};

    const sourceParams = Object.keys(routeObject);
    const targetParams = Object.keys(targetRouteObject);

    for (const targetParam of targetParams) {
      if (
        !isNil(
          invalidation.properties.specification?.[specificationKey]?.[
            targetParam
          ],
        )
      ) {
        // Key is already specified by the user in the specification.
        continue;
      }

      if (!sourceParams.includes(targetParam)) {
        // Source does not have a property with the same name.
        continue;
      }

      invalidation.properties.specification = invalidation.properties
        .specification ?? {
        params: {},
        query: {},
      };
      invalidation.properties.specification[specificationKey] =
        invalidation.properties.specification[specificationKey] ?? {};
      invalidation.properties.specification[specificationKey][targetParam] = [
        specificationKey,
        targetParam,
      ];
    }
  }

  // Check for errors in the specification;
  for (const specificationKey of ["params", "query"]) {
    for (const key of Object.keys(
      invalidation.properties.specification?.[specificationKey] ?? {},
    )) {
      const targetObject =
        structureResolveReference(
          generateContext.structure,
          targetRoute[specificationKey],
        )?.keys ?? {};

      if (isNil(targetObject?.[key])) {
        throw AppError.serverError({
          message: `Invalidation from ${stringFormatNameForError(
            route,
          )} to ${stringFormatNameForError(
            targetRoute,
          )} has an invalid specification. The specified source '${JSON.stringify(
            invalidation.properties.specification[specificationKey][key],
          )}' or target '["${specificationKey}", "${key}"]' does not exists. Both should be defined on their appropriate routes. See the docs for constraints.`,
        });
      }

      const sourceSpecification =
        invalidation.properties.specification[specificationKey][key];

      let sourceLevel = route;
      let isIncorrect = false;
      for (let i = 0; i < sourceSpecification.length; ++i) {
        sourceLevel = sourceLevel?.[sourceSpecification[i]];

        if (isNil(sourceLevel)) {
          isIncorrect = true;
          break;
        }

        if (
          i === sourceSpecification.length - 1 && // @ts-expect-error
          (sourceLevel?.type === "reference"
            ? structureResolveReference(generateContext.structure, sourceLevel)
                ?.type
            : sourceLevel?.type) === "object"
        ) {
          // The last 'key' of the source specification should not be an object
          isIncorrect = true;
          break;
        }

        if (i !== sourceSpecification.length) {
          // @ts-ignore
          sourceLevel =
            sourceLevel?.type === "reference"
              ? structureResolveReference(
                  generateContext.structure,
                  sourceLevel,
                )?.keys
              : sourceLevel?.keys;
        }
      }

      if (isIncorrect) {
        throw AppError.serverError({
          message: `Invalidation from ${stringFormatNameForError(
            route,
          )} to ${stringFormatNameForError(
            targetRoute,
          )} has an invalid specification. The specified source '${JSON.stringify(
            invalidation.properties.specification[specificationKey][key],
          )}' or target '["${specificationKey}", "${key}"]' does not exists. Both should be defined on their appropriate routes. See the docs for constraints.`,
        });
      }
    }
  }
}

/**
 *
 * @param {import("../generated/common/types").ExperimentalRouteInvalidationDefinition["target"]} target
 */
function formatTarget(target) {
  return `(targetGroup: '${target.group}'${
    target.name ? `targetRoute: '${target.name}'` : ""
  })`;
}

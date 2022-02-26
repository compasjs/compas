import { isNil } from "@compas/stdlib";

/**
 * Validate all route invalidation specifications and work out usage of shared params and
 * queries.
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function processRouteInvalidations(context) {
  for (const group of Object.keys(context.structure)) {
    for (const key of Object.keys(context.structure[group])) {
      /** @type {import("../../generated/common/types").CodeGenRouteType} */
      // @ts-ignore
      const route = context.structure[group][key];

      if (route.type !== "route" || route.invalidations.length === 0) {
        continue;
      }

      for (const invalidation of route.invalidations) {
        processInvalidation(context, route, invalidation);
      }
    }
  }
}

/**
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {import("../../generated/common/types").CodeGenRouteInvalidationType} invalidation
 */
function processInvalidation(context, route, invalidation) {
  const targetGroup = context.structure[invalidation.target.group];

  if (isNil(targetGroup)) {
    context.errors.push({
      key: "routerUnknownInvalidationTarget",
      from: route.uniqueName ?? "",
      target: invalidation.target,
    });
    return;
  }

  if (isNil(invalidation.target.name)) {
    // Nothing else to do here, since react-query handles the rest.
    // queryClient.invalidateQueries([invalidation.target.group]);
    return;
  }

  /** @type {import("../../generated/common/types").CodeGenRouteType} */
  // @ts-ignore
  const targetRoute = targetGroup?.[invalidation.target.name];

  if (
    isNil(targetRoute) ||
    targetRoute.type !== "route" ||
    (targetRoute.method !== "GET" &&
      !(targetRoute.method === "POST" && targetRoute.idempotent))
  ) {
    context.errors.push({
      key: "routerUnknownInvalidationTarget",
      from: route.uniqueName ?? "",
      target: invalidation.target,
    });

    return;
  }

  // Properties always default to an object with default properties. This makes the
  // following logic easier, but not at generation time, since we need to check:
  // (Object.keys(invalidation.properties.specification.params).length === 0 &&
  // Object.keys(invalidation.properties.specification.query).length === 0)

  const sharedKeys = [];
  if (invalidation.properties.useSharedParams) {
    sharedKeys.push("params");
  }
  if (invalidation.properties.useSharedQuery) {
    sharedKeys.push("query");
  }

  // Below we use a bunch of `.reference?.keys ?? .keys`, because everything can be a
  // reference.

  for (const specificationKey of sharedKeys) {
    if (
      isNil(route[specificationKey]) ||
      isNil(targetRoute[specificationKey])
    ) {
      continue;
    }

    const routeObject =
      route[specificationKey]?.reference?.keys ?? route[specificationKey]?.keys;
    const targetRouteObject =
      targetRoute[specificationKey]?.reference?.keys ??
      targetRoute[specificationKey]?.keys;

    if (!isNil(routeObject) && !isNil(targetRouteObject)) {
      // @ts-ignore
      const sourceParams = Object.keys(routeObject);
      // @ts-ignore
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
  }

  // Check for errors in the specification;
  for (const specificationKey of ["params", "query"]) {
    for (const key of Object.keys(
      invalidation.properties.specification?.[specificationKey] ?? {},
    )) {
      const targetObject =
        targetRoute[specificationKey]?.reference?.keys ??
        targetRoute[specificationKey]?.keys;

      if (isNil(targetObject?.[key])) {
        // Since we sort of have a valid match, we collect all specification errors and
        // don't early return.
        context.errors.push({
          key: "routerIncorrectlySpecifiedInvalidation",
          from: route.uniqueName ?? "",
          target: invalidation.target,
          sourcePropertyPath:
            invalidation.properties.specification[specificationKey][key],
          targetPropertyPath: ["specification", specificationKey, key],
        });
        continue;
      }

      // TODO: Document constraints of source;
      //  - Should be object type or a reference to an object type
      //  - If nested, all nest levels should be objects;

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
          i === sourceSpecification.length - 1 && // @ts-ignore
          (sourceLevel?.reference?.type ?? sourceLevel?.type) === "object"
        ) {
          // The last 'key' of the source specification should not be an object
          isIncorrect = true;
          break;
        }

        if (i !== sourceSpecification.length) {
          // @ts-ignore
          sourceLevel = sourceLevel?.reference?.keys ?? sourceLevel?.keys;
        }
      }

      if (isIncorrect) {
        context.errors.push({
          key: "routerIncorrectlySpecifiedInvalidation",
          from: route.uniqueName ?? "",
          target: invalidation.target,
          sourcePropertyPath:
            invalidation.properties.specification[specificationKey][key],
          targetPropertyPath: ["specification", specificationKey, key],
        });
      }
    }
  }
}

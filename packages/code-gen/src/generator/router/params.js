import { isNil } from "@compas/stdlib";
import { structureIteratorNamedTypes } from "../../structure/structureIterators.js";

/**
 * Validate all route query & params definitions for correct type converts.
 *
 * HTTP is a string based protocol. Therefore, query and params should be
 * converted back to their defined types after validation.
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function processRouteQueryParams(context) {
  for (const route of structureIteratorNamedTypes(context.structure)) {
    // @ts-expect-error
    if (route.type !== "route" && isNil(route?.params) && isNil(route?.query)) {
      continue;
    }

    // @ts-expect-error
    if (route?.params) {
      // @ts-expect-error
      processRouteParam(context, route, route.params.reference);
    }

    // @ts-expect-error
    if (route?.query) {
      // @ts-expect-error
      processRouteQuery(context, route, route.query.reference);
    }
  }
}

/**
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {import("../../generated/common/types").CodeGenObjectType} param
 */
function processRouteParam(context, route, param) {
  for (const key of Object.keys(param.keys)) {
    const type = param.keys[key];

    if (!["number", "bool"].includes(type.type)) {
      continue;
    }

    // @ts-expect-error
    if (!type.validator?.convert) {
      context.errors.push({
        errorString: `Route ${route.uniqueName} specified an invalid param type, with key: ${key}. Please add '.convert()'.`,
      });
    }
  }
}

/**
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {import("../../generated/common/types").CodeGenRouteType} route
 * @param {import("../../generated/common/types").CodeGenObjectType} query
 */
function processRouteQuery(context, route, query) {
  for (const key of Object.keys(query.keys)) {
    const type = query.keys[key];

    if (!["number", "bool"].includes(type.type)) {
      continue;
    }

    // @ts-expect-error
    if (!type.validator?.convert) {
      context.errors.push({
        errorString: `Route ${route.uniqueName} specified an invalid query type, with key: ${key}. Please add '.convert()'.`,
      });
    }
  }
}

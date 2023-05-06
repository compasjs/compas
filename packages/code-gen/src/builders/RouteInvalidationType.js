import { AppError, isNil } from "@compas/stdlib";

export class RouteInvalidationType {
  constructor(group, name, properties) {
    if (isNil(group)) {
      throw AppError.serverError({
        message: "'group' is mandatory for 'T.invalidates()'.",
      });
    }

    if (
      !isNil(properties) &&
      Object.keys(properties).length > 0 &&
      (isNil(name) || name.length === 0)
    ) {
      throw AppError.serverError({
        message: `If 'properties' are specified, 'name' should be specified as well.`,
      });
    }

    /** @type {import("../generated/common/types.js").ExperimentalRouteInvalidationDefinition} */
    this.data = {
      type: "routeInvalidation",
      target: {
        group,
        name,
      },
      properties: properties ?? {},
    };
  }

  /**
   * @returns {Record<string, any>}
   */
  build() {
    return JSON.parse(JSON.stringify(this.data));
  }
}

import { TypeCreator } from "../builders/index.js";
import { getPrimaryKeyWithType } from "../generator/sql/utils.js";
import { structureAddType } from "../structure/structureAddType.js";
import { structureIteratorNamedTypes } from "../structure/structureIterators.js";
import { upperCaseFirst } from "../utils.js";
import { crudCreateName, crudResolveGroup } from "./resolvers.js";
import {
  crudCallFunctionsForRoutes,
  crudCreateRouteParam,
} from "./route-functions.js";

/**
 * Create the necessary routes based on the available crud types
 *
 * @param {import("../generated/common/types.js").CodeGenContext} context
 */
export function crudCreateRoutes(context) {
  for (const type of structureIteratorNamedTypes(context.structure)) {
    if (!("type" in type) || type.type !== "crud") {
      continue;
    }

    crudCreateRoutesForType(context, type);
  }
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudCreateRoutesForType(context, type) {
  crudCallFunctionsForRoutes(
    {
      listRoute: crudCreateListRoute,
      singleRoute: crudCreateSingleRoute,
      createRoute: crudCreateCreateRoute,
      updateRoute: crudCreateUpdateRoute,
      deleteRoute: crudCreateDeleteRoute,
    },
    type,
    [context, type],
  );

  for (const relation of type.nestedRelations) {
    crudCreateRoutesForType(context, relation);
  }
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudCreateListRoute(context, type) {
  const T = new TypeCreator(type.group);

  const responseType = T.object()
    .keys({
      list: [true],
      total: T.number(),
    })
    .build();

  responseType.keys.list.values = crudCreateReadableType(context, type);

  crudAddRouteTypeToContext(context.structure, type, {
    group: crudResolveGroup(type),
    name: crudCreateName(type, "list"),
    idempotent: true,
    path: crudCreateRoutePath(type, `/list`),
    method: "POST",
    params: crudGetParamsObject(type, { includeSelf: false }),
    query: T.object()
      .keys({
        offset: T.number().default(0).convert(),
        limit: T.number().default(50).convert(),
      })
      .build(),
    body: T.object()
      .keys({
        filters: {},
      })
      .build(),
    response: responseType,
  });
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudCreateSingleRoute(context, type) {
  const T = new TypeCreator(type.group);

  const responseType = T.object()
    .keys({
      item: true,
    })
    .build();

  responseType.keys.item = crudCreateReadableType(context, type);

  crudAddRouteTypeToContext(context.structure, type, {
    group: crudResolveGroup(type),
    name: crudCreateName(type, "single"),
    idempotent: false,
    path: crudCreateRoutePath(
      type,
      type.internalSettings?.usedRelation?.subType === "oneToOneReverse"
        ? `/single`
        : `/:${crudCreateRouteParam(type)}/single`,
    ),
    method: "GET",
    params: crudGetParamsObject(type, { includeSelf: true }),
    response: responseType,
  });
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudCreateCreateRoute(context, type) {
  const T = new TypeCreator(type.group);

  const responseType = T.object()
    .keys({
      item: true,
    })
    .build();

  responseType.keys.item = crudCreateReadableType(context, type);

  const bodyType = crudCreateWriteableType(context, type);

  crudAddRouteTypeToContext(context.structure, type, {
    group: crudResolveGroup(type),
    name: crudCreateName(type, "create"),
    idempotent: false,
    path: crudCreateRoutePath(type, `/create`),
    method: "POST",
    params: crudGetParamsObject(type, { includeSelf: false }),
    body: bodyType,
    response: responseType,
    invalidations: crudCreateInvalidations(type, {
      skipSingleRoute: true,
    }),
  });
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudCreateUpdateRoute(context, type) {
  const T = new TypeCreator(type.group);

  const bodyType = crudCreateWriteableType(context, type);

  crudAddRouteTypeToContext(context.structure, type, {
    group: crudResolveGroup(type),
    name: crudCreateName(type, "update"),
    idempotent: false,
    path: crudCreateRoutePath(
      type,
      type.internalSettings?.usedRelation?.subType === "oneToOneReverse"
        ? `/update`
        : `/:${crudCreateRouteParam(type)}/update`,
    ),
    method: "PUT",
    params: crudGetParamsObject(type, { includeSelf: true }),
    body: bodyType,
    response: T.object()
      .keys({
        success: true,
      })
      .build(),
    invalidations: crudCreateInvalidations(type),
  });
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudCreateDeleteRoute(context, type) {
  const T = new TypeCreator(type.group);

  crudAddRouteTypeToContext(context.structure, type, {
    group: crudResolveGroup(type),
    name: crudCreateName(type, "delete"),
    idempotent: false,
    path: crudCreateRoutePath(
      type,
      type.internalSettings?.usedRelation?.subType === "oneToOneReverse"
        ? `/delete`
        : `/:${crudCreateRouteParam(type)}/delete`,
    ),
    method: "DELETE",
    params: crudGetParamsObject(type, { includeSelf: true }),
    response: T.object()
      .keys({
        success: true,
      })
      .build(),
    invalidations: crudCreateInvalidations(type),
  });
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {{ suffix?: string }} options
 */
function crudCreateReadableType(context, type, { suffix } = {}) {
  const T = new TypeCreator(crudResolveGroup(type));

  const itemType = T.object(
    crudCreateName(type, `${suffix ?? ""}Item`),
  ).build();

  // @ts-expect-error
  itemType.keys = { ...type.entity.reference.keys };

  if (Array.isArray(type.fieldOptions?.readable?.$pick)) {
    for (const key of Object.keys(itemType.keys)) {
      // @ts-expect-error
      if (!type.fieldOptions.readable.$pick.includes(key)) {
        delete itemType.keys[key];
      }
    }
  }

  if (Array.isArray(type.fieldOptions?.readable?.$omit)) {
    // @ts-expect-error
    for (const key of type.fieldOptions.readable.$omit) {
      delete itemType.keys[key];
    }
  }

  for (const inline of type.inlineRelations) {
    inline.fieldOptions.readable = inline.fieldOptions.readable ?? {};
    inline.fieldOptions.readable.$omit =
      inline.fieldOptions.readable.$omit ?? [];

    inline.fieldOptions.readable.$omit.push(
      // @ts-expect-error
      inline.internalSettings.usedRelation.referencedKey,
    );

    // @ts-expect-error
    itemType.keys[inline.fromParent.field] = T.array().values(true).build();
    const inlineType = crudCreateReadableType(context, inline, {
      suffix: suffix?.includes("inline") ? suffix : "inline",
    });

    // @ts-expect-error
    if (inline.internalSettings.usedRelation.subType === "oneToOneReverse") {
      inlineType.isOptional = inline.isOptional;
      // @ts-expect-error
      itemType.keys[inline.fromParent.field] = inlineType;
    } else {
      // @ts-expect-error
      itemType.keys[inline.fromParent.field].values = inlineType;
    }
  }

  // @ts-expect-error
  structureAddType(context.structure, itemType);

  const ref = T.reference(itemType.group, itemType.name).build();
  ref.reference = itemType;

  return ref;
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {{ suffix?: string }} options
 */
function crudCreateWriteableType(context, type, { suffix } = {}) {
  const T = new TypeCreator(crudResolveGroup(type));

  const itemType = T.object(
    crudCreateName(type, `${suffix ?? ""}ItemWrite`),
  ).build();

  // @ts-expect-error
  itemType.keys = { ...type.entity.reference.keys };

  // @ts-expect-error
  const primaryKey = getPrimaryKeyWithType(type.entity.reference);
  delete itemType.keys[primaryKey.key];

  // @ts-expect-error
  if (type.entity.reference.queryOptions?.withDates) {
    delete itemType.keys.createdAt;
    delete itemType.keys.updatedAt;
  }

  if (Array.isArray(type.fieldOptions?.writable?.$pick)) {
    for (const key of Object.keys(itemType.keys)) {
      // @ts-expect-error
      if (!type.fieldOptions.writable.$pick.includes(key)) {
        delete itemType.keys[key];
      }
    }
  }

  type.fieldOptions.writable = type.fieldOptions.writable ?? {};
  type.fieldOptions.writable.$omit = type.fieldOptions.writable.$omit ?? [];

  if (type.fromParent) {
    type.fieldOptions.writable.$omit.push(
      type.internalSettings.usedRelation.referencedKey,
    );
  }

  if (Array.isArray(type.fieldOptions?.writable?.$omit)) {
    // @ts-expect-error
    for (const key of type.fieldOptions.writable.$omit) {
      delete itemType.keys[key];
    }
  }

  for (const inline of type.inlineRelations) {
    inline.fieldOptions.writable = inline.fieldOptions.writable ?? {};
    inline.fieldOptions.writable.$omit =
      inline.fieldOptions.writable.$omit ?? [];

    inline.fieldOptions.writable.$omit.push(
      // @ts-expect-error
      inline.internalSettings.usedRelation.referencedKey,
    );

    // @ts-expect-error
    itemType.keys[inline.fromParent.field] = T.array().values(true).build();
    const inlineType = crudCreateWriteableType(context, inline, {
      suffix: suffix?.includes("inline") ? suffix : "inline",
    });

    // @ts-expect-error
    if (inline.internalSettings.usedRelation.subType === "oneToOneReverse") {
      inlineType.isOptional = inline.isOptional;
      // @ts-expect-error
      itemType.keys[inline.fromParent.field] = inlineType;
    } else {
      // @ts-expect-error
      itemType.keys[inline.fromParent.field].values = inlineType;
    }
  }

  // @ts-expect-error
  structureAddType(context.structure, itemType);

  type.internalSettings.writeableTypeName =
    upperCaseFirst(itemType.group) + upperCaseFirst(itemType.name);

  const ref = T.reference(itemType.group, itemType.name).build();
  ref.reference = itemType;

  return ref;
}

/**
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {{ skipSingleRoute: boolean}} [options]
 * @returns {import("../generated/common/types.js").CodeGenRouteInvalidationType[]}
 */
function crudCreateInvalidations(type, options = {}) {
  /** @type {import("../generated/common/types.js").CodeGenRouteInvalidationType[]} */
  const invalidations = [];

  if (type.routeOptions.listRoute) {
    invalidations.push({
      type: "routeInvalidation",
      target: {
        group: crudResolveGroup(type),
        name: crudCreateName(type, "list"),
      },
      properties: {
        useSharedParams: true,
        useSharedQuery: false,
        specification: {
          params: {},
          query: {},
        },
      },
    });
  }

  if (type.routeOptions.singleRoute && !options.skipSingleRoute) {
    invalidations.push({
      type: "routeInvalidation",
      target: {
        group: crudResolveGroup(type),
        name: crudCreateName(type, "single"),
      },
      properties: {
        useSharedParams: true,
        useSharedQuery: false,
        specification: {
          params: {},
          query: {},
        },
      },
    });
  }

  if (type.fromParent) {
    invalidations.push(
      ...crudCreateInvalidations(type.internalSettings.parent, {}),
    );
  }

  return invalidations;
}

/**
 * Add route and nested types to the structure
 *
 * @param {import("../generated/common/types.js").CodeGenStructure} structure
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {import("../generated/common/types.js").CodeGenRouteType|any} route
 * @returns {void}
 */
export function crudAddRouteTypeToContext(
  structure,
  type,
  {
    group,
    name,
    idempotent,
    path,
    method,
    params,
    query,
    body,
    response,
    invalidations,
  },
) {
  if (params) {
    params.group = group;
    params.name = `${name}Params`;
    structureAddType(structure, params);
  }
  if (query) {
    query.group = group;
    query.name = `${name}Query`;
    structureAddType(structure, query);
  }
  if (body) {
    body.group = group;
    body.name = `${name}Body`;
    structureAddType(structure, body);
  }
  if (response) {
    response.group = group;
    response.name = `${name}Response`;
    structureAddType(structure, response);
  }

  // @ts-expect-error
  structureAddType(structure, {
    type: "route",
    method,
    path,
    idempotent,
    group,
    name,
    tags: [],
    invalidations: invalidations ?? [],
    ...(params
      ? {
          params: {
            type: "reference",
            reference: params,
          },
        }
      : {}),
    ...(query
      ? {
          query: {
            type: "reference",
            reference: query,
          },
        }
      : {}),
    ...(body
      ? {
          body: {
            type: "reference",
            reference: body,
          },
        }
      : {}),
    ...(response
      ? {
          response: {
            type: "reference",
            reference: response,
          },
        }
      : {}),
    docString: type.docString,
  });
}

/**
 *
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {{ includeSelf: boolean }} opts
 * @returns {any}
 */
function crudGetParamsObject(type, { includeSelf }) {
  const keys = {};

  let crudType = includeSelf ? type : type.internalSettings.parent;

  while (crudType) {
    if (
      crudType.internalSettings?.usedRelation?.subType !== "oneToOneReverse"
    ) {
      // @ts-expect-error
      const primaryKey = getPrimaryKeyWithType(crudType.entity.reference);
      keys[crudCreateRouteParam(crudType)] = primaryKey.field;
    }

    crudType = crudType.internalSettings.parent;
  }

  if (Object.keys(keys).length === 0) {
    return;
  }

  const obj = new TypeCreator().object().build();
  obj.keys = keys;

  return obj;
}

/**
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {string|undefined} [suffix]
 * @returns {string}
 */
function crudCreateRoutePath(type, suffix) {
  suffix = suffix ?? "/";

  if (!suffix.startsWith("/")) {
    suffix = `/${suffix}`;
  }

  const path = type.basePath + suffix;

  if (type.fromParent) {
    if (
      type.internalSettings.parent.internalSettings?.usedRelation?.subType ===
      "oneToOneReverse"
    ) {
      return crudCreateRoutePath(
        // @ts-expect-error
        type.internalSettings.parent,
        path,
      );
    }
    return crudCreateRoutePath(
      // @ts-expect-error
      type.internalSettings.parent,

      // @ts-expect-error
      `/:${crudCreateRouteParam(type.internalSettings.parent)}${path}`,
    );
  }

  return path;
}

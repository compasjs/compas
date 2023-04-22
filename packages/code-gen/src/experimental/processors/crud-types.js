import { isNil } from "@compas/stdlib";
import {
  ArrayType,
  BooleanType,
  NumberType,
  ObjectType,
  ReferenceType,
} from "../../builders/index.js";
import { upperCaseFirst } from "../../utils.js";
import {
  crudInformationGetHasCustomReadableType,
  crudInformationGetModel,
  crudInformationGetName,
  crudInformationGetParamName,
  crudInformationGetParent,
  crudInformationGetPath,
  crudInformationGetReadableType,
  crudInformationGetRelation,
  crudInformationGetWritableType,
  crudInformationSetReadableType,
  crudInformationSetWritableType,
} from "./crud-information.js";
import { crudRouteSwitch, structureCrud } from "./crud.js";
import { modelKeyGetPrimary } from "./model-keys.js";
import { modelPartialGetOrderByTypes } from "./model-partials.js";
import { modelWhereGetInformation } from "./model-where.js";
import { structureAddType } from "./structure.js";

/**
 * Generate all types that are necessary for the CRUD items in this structure.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function crudTypesCreate(generateContext) {
  for (const crud of structureCrud(generateContext)) {
    crudTypesCreateItemTypes(generateContext, crud);
    crudTypesRoutes(generateContext, crud);
  }
}

/**
 * Generate the readable and writable types recursively for the provided CRUD
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 * @param {string} [name]
 */
function crudTypesCreateItemTypes(generateContext, crud, name) {
  if (
    crud.routeOptions.listRoute ||
    crud.routeOptions.singleRoute ||
    crud.routeOptions.createRoute
  ) {
    crudTypesItem(generateContext, crud, {
      name: `item${name ?? ""}`,
      type: "readable",
    });
  }

  if (crud.routeOptions.createRoute || crud.routeOptions.updateRoute) {
    crudTypesItem(generateContext, crud, {
      name: `itemWrite${name ?? ""}`,
      type: "writable",
    });
  }

  for (const nestedCrud of crud.nestedRelations) {
    crudTypesCreateItemTypes(
      generateContext,

      // @ts-expect-error
      nestedCrud,
      (name ?? "") + upperCaseFirst(nestedCrud.fromParent?.field),
    );
  }
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 * @param {{
 *   name: string,
 *   type: "readable"|"writable"
 * }} options
 */
function crudTypesItem(generateContext, crud, options) {
  if (
    options.type === "readable" &&
    crudInformationGetHasCustomReadableType(crud)
  ) {
    crudInformationSetReadableType(crud, {
      // @ts-expect-error
      group: crud.fieldOptions.readableType.reference.group,

      // @ts-expect-error
      name: crud.fieldOptions.readableType.reference.name,
    });

    return;
  }

  const model = crudInformationGetModel(crud);
  const relation = crudInformationGetRelation(crud);

  options.name = upperCaseFirst(options.name);

  const itemType = new ObjectType(crud.group, options.name).build();
  itemType.keys = {
    ...model.keys,
  };

  if (options.type === "writable") {
    const { primaryKeyName } = modelKeyGetPrimary(model);
    delete itemType.keys[primaryKeyName];
  }

  if (
    options.type === "writable" &&
    (model.queryOptions?.withDates || model.queryOptions?.withSoftDeletes)
  ) {
    // We don't allow overwriting these fields
    delete itemType.keys.createdAt;
    delete itemType.keys.updatedAt;
  }

  if (Array.isArray(crud.fieldOptions?.[options.type]?.$pick)) {
    for (const key of Object.keys(model.keys)) {
      if (!(crud.fieldOptions?.[options.type]?.$pick ?? []).includes(key)) {
        delete itemType.keys[key];
      }
    }
  }
  if (Array.isArray(crud.fieldOptions?.[options.type]?.$omit)) {
    for (const key of crud.fieldOptions?.[options.type]?.$omit ?? []) {
      delete itemType.keys[key];
    }
  }

  if (crud.fromParent) {
    if (
      relation.subType === "oneToMany" ||
      relation.subType === "oneToOneReverse"
    ) {
      // Don't include the parent primary key again
      delete itemType.keys[crud.fromParent.field];
    }
  }

  for (const inlineCrud of crud.inlineRelations) {
    const relation = crudInformationGetRelation(inlineCrud);

    inlineCrud.fieldOptions ??= {};
    inlineCrud.fieldOptions[options.type] ??= {};
    // @ts-expect-error
    inlineCrud.fieldOptions[options.type].$omit ??= [];
    // @ts-expect-error
    inlineCrud.fieldOptions[options.type].$omit.push(relation.referencedKey);

    // @ts-expect-error
    crudTypesItem(generateContext, inlineCrud, {
      name: `${upperCaseFirst(inlineCrud.fromParent?.field)}Inline${
        options.name
      }`,
      type: options.type,
    });

    const inlineType =
      options.type === "readable"
        ? crudInformationGetReadableType(inlineCrud)
        : crudInformationGetWritableType(inlineCrud);

    if (relation.subType === "oneToMany") {
      // oneToMany always results in an array type, the other relation types return a
      // single entity

      // @ts-expect-error
      itemType.keys[inlineCrud.fromParent.field] = new ArrayType()
        .values(new ReferenceType(inlineType.group, inlineType.name))
        .build();
    } else if (
      options.type === "readable" ||
      relation.subType === "oneToOneReverse"
    ) {
      // On the writable type, we don't support overwriting the referenced side of a
      // relation, since that would break the relation.

      // @ts-expect-error
      itemType.keys[inlineCrud.fromParent.field] = new ReferenceType(
        inlineType.group,
        inlineType.name,
      ).build();
      // @ts-expect-error
      itemType.keys[inlineCrud.fromParent.field].isOptional =
        inlineCrud.isOptional;
    }
  }

  structureAddType(generateContext.structure, itemType, {
    skipReferenceExtraction: true,
  });

  if (options.type === "readable") {
    crudInformationSetReadableType(crud, {
      group: crud.group,
      name: options.name,
    });
  } else if (options.type === "writable") {
    crudInformationSetWritableType(crud, {
      group: crud.group,
      name: options.name,
    });
  }
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesRoutes(generateContext, crud) {
  crudRouteSwitch(
    crud,
    {
      listRoute: crudTypesListRoute,
      singleRoute: crudTypesSingleRoute,
      createRoute: crudTypesCreateRoute,
      updateRoute: crudTypesUpdateRoute,
      deleteRoute: crudTypesDeleteRoute,
    },
    [generateContext, crud],
  );

  for (const relation of crud.nestedRelations) {
    // @ts-expect-error
    crudTypesRoutes(generateContext, relation);
  }
}

/**
 * Build the params object for the provided crud object. Including params necessary for
 * 'parents'.
 *
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 * @param {{ includeSelf: boolean }} options
 */
function crudTypesBuildParamsObject(crud, options) {
  let crudType = options.includeSelf ? crud : crudInformationGetParent(crud);

  const object = new ObjectType().keys({}).build();

  while (crudType) {
    const model = crudInformationGetModel(crudType);
    const relation = crudInformationGetRelation(crudType);
    const { primaryKeyDefinition } = modelKeyGetPrimary(model);

    if (isNil(relation) || relation?.subType === "oneToMany") {
      object.keys[crudInformationGetParamName(crudType)] = primaryKeyDefinition;
    }

    crudType = crudInformationGetParent(crudType);
  }

  object.group = crud.group;

  if (Object.keys(object.keys).length === 0) {
    return;
  }

  return object;
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesListRoute(generateContext, crud) {
  const model = crudInformationGetModel(crud);

  const readableType = crudInformationGetReadableType(crud);
  const routeName = crudInformationGetName(crud, "list");
  const routePath = crudInformationGetPath(crud, "/list");

  const whereObject = crudTypesBuildWhereObject(generateContext, crud);
  const { orderByType, orderBySpecType } = modelPartialGetOrderByTypes(
    generateContext,
    model,
  );
  orderByType.isOptional = true;
  orderBySpecType.isOptional = true;

  const paramsType = crudTypesBuildParamsObject(crud, {
    includeSelf: false,
  });
  if (paramsType) {
    paramsType.name = `${routeName}Params`;
  }

  const queryType = new ObjectType(crud.group, `${routeName}Query`)
    .keys({
      offset: new NumberType().default(0).convert(),
      limit: new NumberType().default(50).max(5000).convert(),
    })
    .build();

  const bodyType = new ObjectType(crud.group, `${routeName}Body`)
    .keys({
      where: new ObjectType().keys({}).optional(),
      orderBy: {},
      orderBySpec: {},
    })
    .build();
  bodyType.keys.orderBy = orderByType;
  bodyType.keys.orderBySpec = orderBySpecType;
  bodyType.keys.where.keys = whereObject;

  const responseType = new ObjectType(crud.group, `${routeName}Response`)
    .keys({
      list: [new ReferenceType(readableType.group, readableType.name)],
      total: new NumberType(),
    })
    .build();

  const routeType = {
    type: "route",
    group: crud.group,
    name: routeName,
    idempotent: true,
    path: routePath,
    method: "POST",
    tags: [],
    invalidations: [],
    docString: `Generated list route for '${model.name}'.`,
    params: paramsType
      ? new ReferenceType(crud.group, paramsType.name).build()
      : undefined,
    query: new ReferenceType(crud.group, queryType.name).build(),
    body: new ReferenceType(crud.group, bodyType.name).build(),
    response: new ReferenceType(crud.group, responseType.name).build(),
  };

  if (paramsType) {
    structureAddType(generateContext.structure, paramsType, {
      skipReferenceExtraction: true,
    });
  }
  structureAddType(generateContext.structure, queryType, {
    skipReferenceExtraction: true,
  });
  structureAddType(generateContext.structure, bodyType, {
    skipReferenceExtraction: true,
  });
  structureAddType(generateContext.structure, responseType, {
    skipReferenceExtraction: true,
  });
  // @ts-expect-error
  structureAddType(generateContext.structure, routeType, {
    skipReferenceExtraction: true,
  });
}

/**
 * Build the where object used in the list route. This is a dumbed down version of the
 * real 'where' object for the model. We do this because various options supported in the
 * query-able where object could lead to slowdowns.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesBuildWhereObject(generateContext, crud) {
  const model = crudInformationGetModel(crud);
  const whereInformation = modelWhereGetInformation(model);

  const result = {};
  const defaults = {
    name: undefined,
    group: undefined,
    uniqueName: undefined,
    isOptional: true,
    defaultValue: undefined,
    docString: "",
  };

  for (const whereField of whereInformation.fields) {
    if (["in", "notIn"].includes(whereField.variant)) {
      // We can't use the builders normally since we need to override some properties
      result[whereField.whereKey] = {
        ...new ArrayType().values(true).build(),
        values: {
          ...model.keys[whereField.modelKey],
          ...defaults,

          // Array values should never be optional.
          isOptional: false,
        },
        ...defaults,
      };
    } else if (
      ["isNull", "isNotNull", "includeNotNull"].includes(whereField.variant)
    ) {
      result[whereField.whereKey] = new BooleanType().optional().build();
    } else {
      result[whereField.whereKey] = {
        ...model.keys[whereField.modelKey],
        ...defaults,
      };
    }
  }

  return result;
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesSingleRoute(generateContext, crud) {
  const model = crudInformationGetModel(crud);
  const relation = crudInformationGetRelation(crud);

  const readableType = crudInformationGetReadableType(crud);
  const routeName = crudInformationGetName(crud, "single");
  const routePath = crudInformationGetPath(
    crud,
    isNil(relation) || relation.subType === "oneToMany"
      ? `/:${crudInformationGetParamName(crud)}/single`
      : "/single",
  );

  const paramsType = crudTypesBuildParamsObject(crud, { includeSelf: true });
  if (paramsType) {
    paramsType.name = `${routeName}Params`;
  }

  const responseType = new ObjectType(crud.group, `${routeName}Response`)
    .keys({
      item: new ReferenceType(readableType.group, readableType.name),
    })
    .build();

  const routeType = {
    type: "route",
    group: crud.group,
    name: routeName,
    idempotent: false,
    path: routePath,
    method: "GET",
    tags: [],
    invalidations: [],
    docString: `Generated single route for '${model.name}'.`,
    params: paramsType
      ? new ReferenceType(crud.group, paramsType.name).build()
      : undefined,
    response: new ReferenceType(crud.group, responseType.name).build(),
  };

  if (paramsType) {
    structureAddType(generateContext.structure, paramsType, {
      skipReferenceExtraction: true,
    });
  }

  structureAddType(generateContext.structure, responseType, {
    skipReferenceExtraction: true,
  });
  // @ts-expect-error
  structureAddType(generateContext.structure, routeType, {
    skipReferenceExtraction: true,
  });
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesCreateRoute(generateContext, crud) {
  const model = crudInformationGetModel(crud);

  const readableType = crudInformationGetReadableType(crud);
  const writableType = crudInformationGetWritableType(crud);
  const routeName = crudInformationGetName(crud, "create");
  const routePath = crudInformationGetPath(crud, "/create");

  const paramsType = crudTypesBuildParamsObject(crud, { includeSelf: false });
  if (paramsType) {
    paramsType.name = `${routeName}Params`;
  }

  const responseType = new ObjectType(crud.group, `${routeName}Response`)
    .keys({
      item: new ReferenceType(readableType.group, readableType.name),
    })
    .build();

  const routeType = {
    type: "route",
    group: crud.group,
    name: routeName,
    idempotent: false,
    path: routePath,
    method: "POST",
    tags: [],
    invalidations: crudTypesRouteInvalidations(crud, {
      skipSingleRoute: true,
    }),
    docString: `Generated create route for '${model.name}'.`,
    params: paramsType
      ? new ReferenceType(crud.group, paramsType.name).build()
      : undefined,
    body: new ReferenceType(writableType.group, writableType.name).build(),
    response: new ReferenceType(crud.group, responseType.name).build(),
  };

  if (paramsType) {
    structureAddType(generateContext.structure, paramsType, {
      skipReferenceExtraction: true,
    });
  }

  structureAddType(generateContext.structure, responseType, {
    skipReferenceExtraction: true,
  });
  // @ts-expect-error
  structureAddType(generateContext.structure, routeType, {
    skipReferenceExtraction: true,
  });
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesUpdateRoute(generateContext, crud) {
  const model = crudInformationGetModel(crud);
  const relation = crudInformationGetRelation(crud);

  const writableType = crudInformationGetWritableType(crud);
  const routeName = crudInformationGetName(crud, "update");
  const routePath = crudInformationGetPath(
    crud,
    isNil(relation) || relation.subType === "oneToMany"
      ? `/:${crudInformationGetParamName(crud)}/update`
      : "/update",
  );

  const paramsType = crudTypesBuildParamsObject(crud, { includeSelf: true });
  if (paramsType) {
    paramsType.name = `${routeName}Params`;
  }

  const responseType = new ObjectType(crud.group, `${routeName}Response`)
    .keys({
      success: true,
    })
    .build();

  const routeType = {
    type: "route",
    group: crud.group,
    name: routeName,
    idempotent: false,
    path: routePath,
    method: "PUT",
    tags: [],
    invalidations: crudTypesRouteInvalidations(crud),
    docString: `Generated update route for '${model.name}'.`,
    params: paramsType
      ? new ReferenceType(crud.group, paramsType.name).build()
      : undefined,
    body: new ReferenceType(writableType.group, writableType.name).build(),
    response: new ReferenceType(crud.group, responseType.name).build(),
  };

  if (paramsType) {
    structureAddType(generateContext.structure, paramsType, {
      skipReferenceExtraction: true,
    });
  }

  structureAddType(generateContext.structure, responseType, {
    skipReferenceExtraction: true,
  });
  // @ts-expect-error
  structureAddType(generateContext.structure, routeType, {
    skipReferenceExtraction: true,
  });
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesDeleteRoute(generateContext, crud) {
  const model = crudInformationGetModel(crud);
  const relation = crudInformationGetRelation(crud);

  const routeName = crudInformationGetName(crud, "delete");
  const routePath = crudInformationGetPath(
    crud,
    isNil(relation) || relation.subType === "oneToMany"
      ? `/:${crudInformationGetParamName(crud)}/delete`
      : "/delete",
  );

  const paramsType = crudTypesBuildParamsObject(crud, { includeSelf: true });
  if (paramsType) {
    paramsType.name = `${routeName}Params`;
  }

  const responseType = new ObjectType(crud.group, `${routeName}Response`)
    .keys({
      success: true,
    })
    .build();

  const routeType = {
    type: "route",
    group: crud.group,
    name: routeName,
    idempotent: false,
    path: routePath,
    method: "DELETE",
    tags: [],
    invalidations: crudTypesRouteInvalidations(crud),
    docString: `Generated delete route for '${model.name}'.`,
    params: paramsType
      ? new ReferenceType(crud.group, paramsType.name).build()
      : undefined,
    response: new ReferenceType(crud.group, responseType.name).build(),
  };

  if (paramsType) {
    structureAddType(generateContext.structure, paramsType, {
      skipReferenceExtraction: true,
    });
  }

  structureAddType(generateContext.structure, responseType, {
    skipReferenceExtraction: true,
  });
  // @ts-expect-error
  structureAddType(generateContext.structure, routeType, {
    skipReferenceExtraction: true,
  });
}

/**
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 * @param {{ skipSingleRoute: boolean}} [options]
 * @returns {import("../generated/common/types.js").ExperimentalRouteInvalidationDefinition[]}
 */
function crudTypesRouteInvalidations(
  crud,
  options = {
    skipSingleRoute: false,
  },
) {
  /** @type {import("../generated/common/types.js").ExperimentalRouteInvalidationDefinition[]} */
  const invalidations = [];

  if (crud.routeOptions.listRoute) {
    invalidations.push({
      type: "routeInvalidation",
      target: {
        group: crud.group,
        name: crudInformationGetName(crud, "list"),
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

  if (crud.routeOptions.singleRoute && !options.skipSingleRoute) {
    invalidations.push({
      type: "routeInvalidation",
      target: {
        group: crud.group,
        name: crudInformationGetName(crud, "single"),
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

  if (crud.fromParent) {
    invalidations.push(
      // @ts-expect-error
      ...crudTypesRouteInvalidations(crudInformationGetParent(crud), {}),
    );
  }

  return invalidations;
}

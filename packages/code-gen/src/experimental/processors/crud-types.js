import { ArrayType, ObjectType, ReferenceType } from "../../builders/index.js";
import { upperCaseFirst } from "../../utils.js";
import {
  crudInformationGetModel,
  crudInformationGetReadableType,
  crudInformationGetRelation,
  crudInformationGetWritableType,
  crudInformationSetReadableType,
  crudInformationSetWritableType,
} from "./crud-information.js";
import { crudRouteSwitch, structureCrud } from "./crud.js";
import { structureAddType } from "./structure.js";

/**
 * Generate all types that are necessary for the CRUD items in this structure.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function crudTypesCreate(generateContext) {
  for (const crud of structureCrud(generateContext)) {
    if (
      crud.routeOptions.listRoute ||
      crud.routeOptions.singleRoute ||
      crud.routeOptions.createRoute
    ) {
      crudTypesItem(generateContext, crud, {
        name: "item",
        type: "readable",
      });
    }

    if (crud.routeOptions.createRoute || crud.routeOptions.updateRoute) {
      crudTypesItem(generateContext, crud, {
        name: "itemWrite",
        type: "writable",
      });
    }
    crudTypesRoutes(generateContext, crud);
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
  const model = crudInformationGetModel(crud);

  const itemType = new ObjectType(crud.group, options.name).build();
  itemType.keys = {
    ...model.keys,
  };

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
    delete itemType.keys[crud.fromParent.field];
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
      name: `${options.name}${upperCaseFirst(inlineCrud.fromParent?.field)}`,
      type: options.type,
    });

    const inlineType =
      options.type === "readable"
        ? crudInformationGetReadableType(inlineCrud)
        : crudInformationGetWritableType(inlineCrud);

    if (relation.subType === "oneToOneReverse") {
      // @ts-expect-error
      itemType.keys[inlineCrud.fromParent.field] = new ReferenceType(
        inlineType.group,
        inlineType.name,
      ).build();
      // @ts-expect-error
      itemType.keys[inlineCrud.fromParent.field].isOptional =
        inlineCrud.isOptional;
    } else {
      // @ts-expect-error
      itemType.keys[inlineCrud.fromParent.field] = new ArrayType()
        .values(new ReferenceType(inlineType.group, inlineType.name))
        .build();
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
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesListRoute(generateContext, crud) {
  // TODO: Implement

  return crud;
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesSingleRoute(generateContext, crud) {
  // TODO: Implement

  return crud;
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesCreateRoute(generateContext, crud) {
  // TODO: Implement

  return crud;
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesUpdateRoute(generateContext, crud) {
  // TODO: Implement

  return crud;
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudTypesDeleteRoute(generateContext, crud) {
  // TODO: Implement

  return crud;
}

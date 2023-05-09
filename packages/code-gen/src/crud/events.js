import { isNil } from "@compas/stdlib";
import { fileContextCreateGeneric } from "../file/context.js";
import { fileWrite } from "../file/write.js";
import {
  crudInformationGetHasCustomReadableType,
  crudInformationGetModel,
  crudInformationGetName,
  crudInformationGetReadableType,
  crudInformationGetRelation,
  crudInformationGetWritableType,
} from "../processors/crud-information.js";
import { crudRouteSwitch, structureCrud } from "../processors/crud.js";
import { modelKeyGetPrimary } from "../processors/model-keys.js";
import { structureResolveReference } from "../processors/structure.js";
import { JavascriptImportCollector } from "../target/javascript.js";
import { upperCaseFirst } from "../utils.js";
import {
  crudPartialEventCount,
  crudPartialEventCreate,
  crudPartialEventDelete,
  crudPartialEventList,
  crudPartialEventSingle,
  crudPartialEventTransformer,
  crudPartialEventUpdate,
} from "./partials/events.js";
import { crudQueryBuilderGet } from "./query-builder.js";

/**
 * Generate events that are necessary for CRUD. This currently only works with js and Koa.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function crudEventsGenerate(generateContext) {
  if (generateContext.options.targetLanguage !== "js") {
    return;
  }

  if (isNil(generateContext.options.generators.router?.target?.library)) {
    return;
  }

  // TODO: the types used in the generated events expect global types, handle support for global or imported types.
  //  The types will be generated tho by for example the router generator, but that is implicitly done instead of the explicitness that we want.

  for (const crud of structureCrud(generateContext)) {
    const file = crudEventsFile(generateContext, crud);

    crudEventsGenerateForType(generateContext, file, crud);
  }
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudEventsGenerateForType(generateContext, file, crud) {
  crudRouteSwitch(
    crud,
    {
      listRoute: crudEventsList,
      singleRoute: crudEventsSingle,
      createRoute: crudEventsCreate,
      updateRoute: crudEventsUpdate,
      deleteRoute: crudEventsDelete,
    },
    [generateContext, file, crud],
  );

  if (
    !crud.routeOptions.singleRoute &&
    (crud.routeOptions.createRoute ||
      crud.routeOptions.updateRoute ||
      crud.routeOptions.deleteRoute)
  ) {
    crudEventsSingle(generateContext, file, crud);
  }

  if (
    crudInformationGetHasCustomReadableType(crud) === false &&
    (crud.routeOptions.listRoute ||
      crud.routeOptions.singleRoute ||
      crud.routeOptions.createRoute)
  ) {
    crudEventsTransform(generateContext, file, crud);
  }

  for (const nestedCrud of crud.nestedRelations) {
    // @ts-expect-error
    crudEventsGenerateForType(generateContext, file, nestedCrud);
  }
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudEventsFile(generateContext, crud) {
  return fileContextCreateGeneric(generateContext, `${crud.group}/events.js`, {
    importCollector: new JavascriptImportCollector(),
  });
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudEventsList(generateContext, file, crud) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);
  const model = crudInformationGetModel(crud);
  const { primaryKeyName, primaryKeyDefinition } = modelKeyGetPrimary(model);
  const primaryKeyType =
    primaryKeyDefinition.type === "reference"
      ? structureResolveReference(
          generateContext.structure,
          primaryKeyDefinition,
        ).type
      : primaryKeyDefinition.type;

  importCollector.destructure("@compas/stdlib", "eventStart");
  importCollector.destructure("@compas/stdlib", "eventStop");
  importCollector.destructure(
    `../database/${model.name}.js`,
    `query${upperCaseFirst(model.name)}`,
  );

  const data = {
    crudName: crud.group + upperCaseFirst(crudInformationGetName(crud, "")),
    entityName: model.name,
    entityUniqueName: upperCaseFirst(model.group) + upperCaseFirst(model.name),
    primaryKey: primaryKeyName,
    primaryKeyType: primaryKeyType === "number" ? "number" : "string",
  };

  // @ts-expect-error
  fileWrite(file, crudPartialEventCount(data));
  // @ts-expect-error
  fileWrite(file, crudPartialEventList(data));
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudEventsSingle(generateContext, file, crud) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);
  const model = crudInformationGetModel(crud);

  importCollector.destructure("@compas/stdlib", "AppError");
  importCollector.destructure("@compas/stdlib", "eventStart");
  importCollector.destructure("@compas/stdlib", "eventStop");
  importCollector.destructure(
    `../database/${model.name}.js`,
    `query${upperCaseFirst(model.name)}`,
  );

  const data = {
    crudName: crud.group + upperCaseFirst(crudInformationGetName(crud, "")),
    entityName: model.name,
    entityUniqueName: upperCaseFirst(model.group) + upperCaseFirst(model.name),
  };

  // @ts-expect-error
  fileWrite(file, crudPartialEventSingle(data));
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudEventsCreate(generateContext, file, crud) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);
  const model = crudInformationGetModel(crud);
  const { primaryKeyName } = modelKeyGetPrimary(model);

  importCollector.destructure("@compas/stdlib", "eventStart");
  importCollector.destructure("@compas/stdlib", "eventStop");
  importCollector.destructure("@compas/stdlib", "newEventFromEvent");
  importCollector.destructure(`../common/database.js`, `queries`);

  const data = {
    crudName: crud.group + upperCaseFirst(crudInformationGetName(crud, "")),
    entityName: model.name,
    entityUniqueName: upperCaseFirst(model.group) + upperCaseFirst(model.name),
    primaryKey: primaryKeyName,
    writableType: crudInformationGetWritableType(crud),

    inlineRelations: crudEventsGetInlineRelations(crud),
    builder: crudQueryBuilderGet(crud, {
      includeOwnParam: false,
      includeJoins: true,
      traverseParents: false,
    }),
  };

  // @ts-expect-error
  fileWrite(file, crudPartialEventCreate(data));
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudEventsUpdate(generateContext, file, crud) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);
  const model = crudInformationGetModel(crud);
  const { primaryKeyName } = modelKeyGetPrimary(model);

  importCollector.destructure("@compas/stdlib", "eventStart");
  importCollector.destructure("@compas/stdlib", "eventStop");
  importCollector.destructure(`../common/database.js`, `queries`);

  const data = {
    crudName: crud.group + upperCaseFirst(crudInformationGetName(crud, "")),
    entityName: model.name,
    entityUniqueName: upperCaseFirst(model.group) + upperCaseFirst(model.name),
    primaryKey: primaryKeyName,
    writableType: crudInformationGetWritableType(crud),

    inlineRelations: crudEventsGetInlineRelations(crud),
  };

  // @ts-expect-error
  fileWrite(file, crudPartialEventUpdate(data));
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudEventsDelete(generateContext, file, crud) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);
  const model = crudInformationGetModel(crud);
  const { primaryKeyName } = modelKeyGetPrimary(model);

  importCollector.destructure("@compas/stdlib", "eventStart");
  importCollector.destructure("@compas/stdlib", "eventStop");
  importCollector.destructure(`../common/database.js`, `queries`);

  const data = {
    crudName: crud.group + upperCaseFirst(crudInformationGetName(crud, "")),
    entityName: model.name,
    entityUniqueName: upperCaseFirst(model.group) + upperCaseFirst(model.name),
    primaryKey: primaryKeyName,
  };

  // @ts-expect-error
  fileWrite(file, crudPartialEventDelete(data));
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudEventsTransform(generateContext, file, crud) {
  const model = crudInformationGetModel(crud);

  const data = {
    crudName: crud.group + upperCaseFirst(crudInformationGetName(crud, "")),
    entityName: model.name,
    entityUniqueName: upperCaseFirst(model.group) + upperCaseFirst(model.name),
    readableType: crudInformationGetReadableType(crud),

    entity: crudEventsGetEntityTransformer(crud),
  };

  // @ts-expect-error
  fileWrite(file, crudPartialEventTransformer(data));
}

/**
 * Get metadata about inline relations for create and update events
 *
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudEventsGetInlineRelations(crud) {
  const result = [];

  const parentModel = crudInformationGetModel(crud);
  const { primaryKeyName } = modelKeyGetPrimary(parentModel);

  for (const inlineCrud of crud.inlineRelations) {
    const model = crudInformationGetModel(inlineCrud);
    const relation = crudInformationGetRelation(inlineCrud);

    result.push({
      // @ts-expect-error
      name: inlineCrud.fromParent.field,

      referencedKey: relation.referencedKey,
      entityName: model.name,
      isInlineArray: relation.subType === "oneToMany",
      isOwningSideOfRelation:
        relation.subType === "manyToOne" || relation.subType === "oneToOne",

      // @ts-expect-error
      inlineRelations: crudEventsGetInlineRelations(inlineCrud),
      isOptional: inlineCrud.isOptional,
      parentPrimaryKey: primaryKeyName,
    });
  }

  return result;
}

/**
 * Get the transformer mapping for the provided crud
 *
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudEventsGetEntityTransformer(crud) {
  const model = crudInformationGetModel(crud);

  let keys = Object.keys(model.keys);
  // @ts-expect-error
  if (crud.fieldOptions?.readable?.$pick?.length > 0) {
    keys = crud.fieldOptions?.readable?.$pick ?? [];
  }

  for (const omit of crud.fieldOptions?.readable?.$omit ?? []) {
    if (keys.includes(omit)) {
      keys.splice(keys.indexOf(omit), 1);
    }
  }

  const result = {};
  for (const key of keys) {
    result[key] = true;
  }

  for (const inlineCrud of crud.inlineRelations) {
    const relation = crudInformationGetRelation(inlineCrud);
    // @ts-expect-error
    const nested = crudEventsGetEntityTransformer(inlineCrud);

    // @ts-expect-error
    result[inlineCrud.fromParent.field] =
      relation.subType === "oneToMany" ? [nested] : nested;
  }

  return result;
}

import { generateTypeDefinition } from "../generator/types.js";
import { importCreator } from "../generator/utils.js";
import { partialAsString } from "../partials/helpers.js";
import { structureIteratorNamedTypes } from "../structure/structureIterators.js";
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
import { crudCreateName, crudResolveGroup } from "./resolvers.js";
import { crudCallFunctionsForRoutes } from "./route-functions.js";
import { crudFormatBuilder, crudGetBuilder } from "./route-implementer.js";

/**
 * Create the events for all the CRUD routes
 *
 * @param {import("../generated/common/types.js").CodeGenContext} context
 */
export function crudGenerateEventImplementations(context) {
  for (const type of structureIteratorNamedTypes(context.structure)) {
    if (!("type" in type) || type.type !== "crud") {
      continue;
    }

    const importer = importCreator();
    const sources = [];

    crudGenerateEventImplementationForType(context, importer, sources, type);

    sources.unshift(importer.print());

    context.outputFiles.push({
      contents: partialAsString(sources),
      relativePath: `./${type.group}/events.js`,
    });
  }
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateEventImplementationForType(
  context,
  importer,
  sources,
  type,
) {
  crudCallFunctionsForRoutes(
    {
      listRoute: crudGenerateEventImplementationListRoute,
      singleRoute: crudGenerateEventImplementationSingleRoute,
      createRoute: crudGenerateEventImplementationCreateRoute,
      updateRoute: crudGenerateEventImplementationUpdateRoute,
      deleteRoute: crudGenerateEventImplementationDeleteRoute,
    },
    type,
    [context, importer, sources, type],
  );

  if (
    type.routeOptions.listRoute ||
    type.routeOptions.singleRoute ||
    type.routeOptions.createRoute
  ) {
    crudGenerateEventImplementationTransformer(
      context,
      importer,
      sources,
      type,
    );
  }

  for (const relation of type.nestedRelations) {
    crudGenerateEventImplementationForType(
      context,
      importer,
      sources,
      relation,
    );
  }
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateEventImplementationListRoute(
  context,
  importer,
  sources,
  type,
) {
  const data = {
    crudName: crudResolveGroup(type) + upperCaseFirst(crudCreateName(type, "")),

    // @ts-expect-error
    entityName: type.entity.reference.name,

    // @ts-expect-error
    entityUniqueName: type.entity.reference.uniqueName,
    primaryKey: type.internalSettings.primaryKey.key,
    primaryKeyType: generateTypeDefinition(
      context,
      type.internalSettings.primaryKey.field,
      {
        useDefaults: true,
      },
    ),
  };

  importer.destructureImport("eventStart", "@compas/stdlib");
  importer.destructureImport("eventStop", "@compas/stdlib");
  importer.destructureImport(
    `query${upperCaseFirst(data.entityName)}`,
    `../database/${data.entityName}.js`,
  );

  sources.push(crudPartialEventCount(data), crudPartialEventList(data));
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateEventImplementationSingleRoute(
  context,
  importer,
  sources,
  type,
) {
  const data = {
    crudName: crudResolveGroup(type) + upperCaseFirst(crudCreateName(type, "")),

    // @ts-expect-error
    entityName: type.entity.reference.name,

    // @ts-expect-error
    entityUniqueName: type.entity.reference.uniqueName,
  };

  importer.destructureImport("AppError", "@compas/stdlib");
  importer.destructureImport("eventStart", "@compas/stdlib");
  importer.destructureImport("eventStop", "@compas/stdlib");
  importer.destructureImport(
    `query${upperCaseFirst(data.entityName)}`,
    `../database/${data.entityName}.js`,
  );

  sources.push(crudPartialEventSingle(data));
}

function crudInlineRelationData(type) {
  return type.inlineRelations.map((it) => ({
    name: it.fromParent.field,
    referencedKey: it.internalSettings.usedRelation.referencedKey,
    entityName: it.entity.reference.name,
    isInlineArray: it.internalSettings.usedRelation.subType === "oneToMany",
    inlineRelations: crudInlineRelationData(it),
    isOptional: it.isOptional,
    parentPrimaryKey: type.internalSettings.primaryKey.key,
  }));
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateEventImplementationCreateRoute(
  context,
  importer,
  sources,
  type,
) {
  const data = {
    crudName: crudResolveGroup(type) + upperCaseFirst(crudCreateName(type, "")),

    // @ts-expect-error
    entityName: type.entity.reference.name,

    // @ts-expect-error
    entityUniqueName: type.entity.reference.uniqueName,
    primaryKey: type.internalSettings.primaryKey.key,
    inlineRelations: crudInlineRelationData(type),
    builder: crudFormatBuilder(
      crudGetBuilder(type, {
        includeOwnParam: false,
        includeJoins: true,
        traverseParents: false,
      }),
    ),
  };

  if (!type.routeOptions.singleRoute) {
    crudGenerateEventImplementationSingleRoute(
      context,
      importer,
      sources,
      type,
    );
  }

  importer.destructureImport("eventStart", "@compas/stdlib");
  importer.destructureImport("eventStop", "@compas/stdlib");
  importer.destructureImport("newEventFromEvent", "@compas/stdlib");
  importer.destructureImport(`queries`, `../database/index.js`);

  sources.push(crudPartialEventCreate(data));
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateEventImplementationUpdateRoute(
  context,
  importer,
  sources,
  type,
) {
  const data = {
    crudName: crudResolveGroup(type) + upperCaseFirst(crudCreateName(type, "")),

    // @ts-expect-error
    entityName: type.entity.reference.name,

    // @ts-expect-error
    entityUniqueName: type.entity.reference.uniqueName,
    primaryKey: type.internalSettings.primaryKey.key,
    inlineRelations: crudInlineRelationData(type),
  };

  if (!type.routeOptions.singleRoute) {
    crudGenerateEventImplementationSingleRoute(
      context,
      importer,
      sources,
      type,
    );
  }

  importer.destructureImport("eventStart", "@compas/stdlib");
  importer.destructureImport("eventStop", "@compas/stdlib");
  importer.destructureImport(`queries`, `../database/index.js`);

  sources.push(crudPartialEventUpdate(data));
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateEventImplementationDeleteRoute(
  context,
  importer,
  sources,
  type,
) {
  const data = {
    crudName: crudResolveGroup(type) + upperCaseFirst(crudCreateName(type, "")),

    // @ts-expect-error
    entityName: type.entity.reference.name,

    // @ts-expect-error
    entityUniqueName: type.entity.reference.uniqueName,
    primaryKey: type.internalSettings.primaryKey.key,
  };

  if (!type.routeOptions.singleRoute) {
    crudGenerateEventImplementationSingleRoute(
      context,
      importer,
      sources,
      type,
    );
  }

  importer.destructureImport("eventStart", "@compas/stdlib");
  importer.destructureImport("eventStop", "@compas/stdlib");
  importer.destructureImport(`queries`, `../database/index.js`);

  sources.push(crudPartialEventDelete(data));
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateEventImplementationTransformer(
  context,
  importer,
  sources,
  type,
) {
  const data = {
    crudName: crudResolveGroup(type) + upperCaseFirst(crudCreateName(type, "")),

    // @ts-expect-error
    entityName: type.entity.reference.name,

    // @ts-expect-error
    entityUniqueName: type.entity.reference.uniqueName,
    entity: crudBuildTransformEntity(type),
  };

  // @ts-expect-error
  sources.push(crudPartialEventTransformer(data));
}

/**
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudBuildTransformEntity(type) {
  // @ts-expect-error
  let keys = Object.keys(type.entity.reference.keys);

  // @ts-expect-error
  if (type.fieldOptions?.readable?.$pick?.length > 0) {
    // @ts-expect-error
    keys = type.fieldOptions?.readable.$pick;
  }

  for (const omit of type.fieldOptions?.readable?.$omit ?? []) {
    if (keys.indexOf(omit) !== -1) {
      keys.splice(keys.indexOf(omit), 1);
    }
  }

  const result = {};
  for (const key of keys) {
    result[key] = true;
  }

  for (const relation of type.inlineRelations) {
    const nested = crudBuildTransformEntity(relation);

    // @ts-expect-error
    result[relation.fromParent.field] = // @ts-expect-error
      relation.internalSettings.usedRelation.subType === "oneToMany"
        ? [nested]
        : nested;
  }

  return result;
}

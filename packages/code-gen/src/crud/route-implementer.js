import { importCreator } from "../generator/utils.js";
import { partialAsString } from "../partials/helpers.js";
import { structureIteratorNamedTypes } from "../structure/structureIterators.js";
import { upperCaseFirst } from "../utils.js";
import {
  partialCrudCount,
  partialCrudCreate,
  partialCrudDelete,
  partialCrudList,
  partialCrudSingle,
  partialCrudTransformer,
  partialCrudUpdate,
} from "./partials/events.js";
import { crudCreateName, crudResolveGroup } from "./resolvers.js";
import { crudCallFunctionsForRoutes } from "./route-functions.js";

/**
 * Create the implementations of all generated routes
 *
 * @param {import("../generated/common/types.js").CodeGenContext} context
 */
export function crudGenerateImplementations(context) {
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
    type.routeOptions.listRoute !== false ||
    type.routeOptions.singleRoute !== false ||
    type.routeOptions.createRoute !== false
  ) {
    crudGenerateEventImplementationTransformer(
      context,
      importer,
      sources,
      type,
    );
  }

  // todo; transformer if list, single or create

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
    entityName: type.entity.reference.name,
    entityUniqueName: type.entity.reference.uniqueName,
  };

  importer.destructureImport("eventStart", "@compas/stdlib");
  importer.destructureImport("eventStop", "@compas/stdlib");
  importer.destructureImport(
    `query${upperCaseFirst(data.entityName)}`,
    `../database/${data.entityName}.js`,
  );

  sources.push(partialCrudCount(data), partialCrudList(data));
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
    entityName: type.entity.reference.name,
    entityUniqueName: type.entity.reference.uniqueName,
  };

  importer.destructureImport("AppError", "@compas/stdlib");
  importer.destructureImport("eventStart", "@compas/stdlib");
  importer.destructureImport("eventStop", "@compas/stdlib");
  importer.destructureImport(
    `query${upperCaseFirst(data.entityName)}`,
    `../database/${data.entityName}.js`,
  );

  sources.push(partialCrudSingle(data));
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
    entityName: type.entity.reference.name,
    entityUniqueName: type.entity.reference.uniqueName,
  };

  if (type.routeOptions.singleRoute === false) {
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

  sources.push(partialCrudCreate(data));
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
    entityName: type.entity.reference.name,
    entityUniqueName: type.entity.reference.uniqueName,
  };

  if (type.routeOptions.singleRoute === false) {
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

  sources.push(partialCrudUpdate(data));
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
    entityName: type.entity.reference.name,
    entityUniqueName: type.entity.reference.uniqueName,
  };

  if (type.routeOptions.singleRoute === false) {
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

  sources.push(partialCrudDelete(data));
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
    entityName: type.entity.reference.name,
    entityUniqueName: type.entity.reference.uniqueName,
    entity: crudBuildTransformEntity(type),
  };

  sources.push(partialCrudTransformer(data));
}

/**
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudBuildTransformEntity(type) {
  let keys = Object.keys(type.entity.reference.keys);

  if (type.fieldOptions?.readable?.$pick?.length > 0) {
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

    result[relation.fromParent.field] =
      relation.internalSettings.usedRelation.subType === "oneToMany"
        ? [nested]
        : nested;
  }

  return result;
}

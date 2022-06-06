import { getPrimaryKeyWithType } from "../generator/sql/utils.js";
import { importCreator } from "../generator/utils.js";
import { partialAsString } from "../partials/helpers.js";
import { structureIteratorNamedTypes } from "../structure/structureIterators.js";
import { upperCaseFirst } from "../utils.js";
import {
  crudPartialRouteCreate,
  crudPartialRouteDelete,
  crudPartialRouteList,
  crudPartialRouteSingle,
  crudPartialRouteUpdate,
} from "./partials/routes.js";
import { crudCreateName, crudResolveGroup } from "./resolvers.js";
import {
  crudCallFunctionsForRoutes,
  crudCreateRouteParam,
} from "./route-functions.js";

/**
 * Create the implementation of the controllers, including hooks
 *
 * @param {import("../generated/common/types.js").CodeGenContext} context
 */
export function crudGenerateRouteImplementations(context) {
  for (const type of structureIteratorNamedTypes(context.structure)) {
    if (!("type" in type) || type.type !== "crud") {
      continue;
    }

    const importer = importCreator();
    const sources = [];

    crudGenerateRouteImplementationForType(context, importer, sources, type);

    sources.unshift(`
/**
 * Register controller implementations for the '${crudResolveGroup(
   type,
 )}' routes.
 *
 * This function accepts various optional hooks that will be called in the implementations.
 *
 * @param {{
 *   sql: Postgres,
 * }} options
 */
export function ${crudResolveGroup(type)}RegisterCrud({ sql }) {
  
`);
    sources.push("}");
    sources.unshift(importer.print());

    context.outputFiles.push({
      contents: partialAsString(sources),
      relativePath: `./${type.group}/crud.js`,
    });
  }
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateRouteImplementationForType(
  context,
  importer,
  sources,
  type,
) {
  crudCallFunctionsForRoutes(
    {
      listRoute: crudGenerateRouteImplementationListRoute,
      singleRoute: crudGenerateRouteImplementationSingleRoute,
      createRoute: crudGenerateRouteImplementationCreateRoute,
      updateRoute: crudGenerateRouteImplementationUpdateRoute,
      deleteRoute: crudGenerateRouteImplementationDeleteRoute,
    },
    type,
    [context, importer, sources, type],
  );

  for (const relation of type.nestedRelations) {
    crudGenerateRouteImplementationForType(
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
function crudGenerateRouteImplementationListRoute(
  context,
  importer,
  sources,
  type,
) {
  const data = {
    handlerName: `${crudResolveGroup(type)}Handlers.${crudCreateName(
      type,
      "list",
    )}`,
    crudName: crudResolveGroup(type) + upperCaseFirst(crudCreateName(type, "")),
    countBuilder: crudFormatBuilder(
      crudGetBuilder(type, {
        includeOwnParam: false,
        includeJoins: false,
        traverseParents: true,
      }),
    ),
    listBuilder: crudFormatBuilder(
      crudGetBuilder(type, {
        includeOwnParam: false,
        includeJoins: true,
        traverseParents: false,
      }),
    ),
  };

  importer.destructureImport(`newEventFromEvent`, "@compas/stdlib");
  importer.destructureImport(`${data.crudName}Count`, "./events.js");
  importer.destructureImport(`${data.crudName}List`, "./events.js");
  importer.destructureImport(`${data.crudName}Transform`, "./events.js");
  importer.destructureImport(
    `${crudResolveGroup(type)}Handlers`,
    "./controller.js",
  );

  sources.push(crudPartialRouteList(data));
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateRouteImplementationSingleRoute(
  context,
  importer,
  sources,
  type,
) {
  const data = {
    handlerName: `${crudResolveGroup(type)}Handlers.${crudCreateName(
      type,
      "single",
    )}`,
    crudName: crudResolveGroup(type) + upperCaseFirst(crudCreateName(type, "")),
    builder: crudFormatBuilder(
      crudGetBuilder(type, {
        includeOwnParam: true,
        includeJoins: true,
        traverseParents: true,
      }),
    ),
  };

  importer.destructureImport(`newEventFromEvent`, "@compas/stdlib");
  importer.destructureImport(`${data.crudName}Transform`, "./events.js");
  importer.destructureImport(`${data.crudName}Single`, "./events.js");
  importer.destructureImport(
    `${crudResolveGroup(type)}Handlers`,
    "./controller.js",
  );

  sources.push(crudPartialRouteSingle(data));
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateRouteImplementationCreateRoute(
  context,
  importer,
  sources,
  type,
) {
  const data = {
    handlerName: `${crudResolveGroup(type)}Handlers.${crudCreateName(
      type,
      "create",
    )}`,
    crudName: crudResolveGroup(type) + upperCaseFirst(crudCreateName(type, "")),
  };

  importer.destructureImport(`newEventFromEvent`, "@compas/stdlib");
  importer.destructureImport(`${data.crudName}Transform`, "./events.js");
  importer.destructureImport(`${data.crudName}Create`, "./events.js");
  importer.destructureImport(
    `${crudResolveGroup(type)}Handlers`,
    "./controller.js",
  );

  sources.push(crudPartialRouteCreate(data));
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateRouteImplementationUpdateRoute(
  context,
  importer,
  sources,
  type,
) {
  const data = {
    handlerName: `${crudResolveGroup(type)}Handlers.${crudCreateName(
      type,
      "update",
    )}`,
    crudName: crudResolveGroup(type) + upperCaseFirst(crudCreateName(type, "")),
    builder: crudFormatBuilder(
      crudGetBuilder(type, {
        includeOwnParam: true,
        includeJoins: true,
        traverseParents: true,
      }),
    ),
  };

  importer.destructureImport(`newEventFromEvent`, "@compas/stdlib");
  importer.destructureImport(`${data.crudName}Update`, "./events.js");
  importer.destructureImport(`${data.crudName}Single`, "./events.js");
  importer.destructureImport(
    `${crudResolveGroup(type)}Handlers`,
    "./controller.js",
  );

  sources.push(crudPartialRouteUpdate(data));
}

/**
 * @param {import("../generated/common/types.js").CodeGenContext} context
 * @param {import("../generator/utils.js").ImportCreator} importer
 * @param {string[]} sources
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 */
function crudGenerateRouteImplementationDeleteRoute(
  context,
  importer,
  sources,
  type,
) {
  const data = {
    handlerName: `${crudResolveGroup(type)}Handlers.${crudCreateName(
      type,
      "delete",
    )}`,
    crudName: crudResolveGroup(type) + upperCaseFirst(crudCreateName(type, "")),
    builder: crudFormatBuilder(
      crudGetBuilder(type, {
        includeOwnParam: true,
        includeJoins: false,
        traverseParents: true,
      }),
    ),
  };

  importer.destructureImport(`newEventFromEvent`, "@compas/stdlib");
  importer.destructureImport(`${data.crudName}Delete`, "./events.js");
  importer.destructureImport(`${data.crudName}Single`, "./events.js");
  importer.destructureImport(
    `${crudResolveGroup(type)}Handlers`,
    "./controller.js",
  );

  sources.push(crudPartialRouteDelete(data));
}

/**
 * @param {any} builder
 * @returns {string}
 */
export function crudFormatBuilder(builder) {
  return JSON.stringify(builder, null, 2).replace(/"/gi, "");
}

/**
 *
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {{ includeOwnParam, includeJoins, traverseParents }} opts
 * @returns {any}
 */
export function crudGetBuilder(
  type,
  { includeOwnParam, includeJoins, traverseParents },
) {
  const result = {
    where: {},
  };

  const crudType = type;

  if (includeJoins) {
    for (const relation of crudType.inlineRelations) {
      // @ts-expect-error
      result[relation.fromParent.field] = crudGetBuilder(relation, {
        includeOwnParam: false,
        includeJoins: true,
        traverseParents: false,
      });
    }
  }

  if (includeOwnParam) {
    // @ts-expect-error
    const primaryKey = getPrimaryKeyWithType(crudType.entity.reference);
    result.where[primaryKey.key] = `ctx.validatedParams.${crudCreateRouteParam(
      crudType,
    )}`;
  }

  if (traverseParents && type.internalSettings.parent) {
    result[ // @ts-expect-error
      `via${upperCaseFirst(type.internalSettings.usedRelation.referencedKey)}`
    ] = crudGetBuilder(type.internalSettings.parent, {
      includeOwnParam: true,
      includeJoins: false,
      traverseParents: true,
    });
  }

  return result;
}

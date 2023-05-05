import { isNil } from "@compas/stdlib";
import { upperCaseFirst } from "../../utils.js";
import { fileBlockEnd, fileBlockStart } from "../file/block.js";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextRemoveLinePrefix,
  fileContextSetIndent,
} from "../file/context.js";
import { fileFormatInlineComment } from "../file/docs.js";
import { fileWrite } from "../file/write.js";
import {
  crudInformationGetHasCustomReadableType,
  crudInformationGetModel,
  crudInformationGetName,
  crudInformationGetParamName,
  crudInformationGetParent,
  crudInformationGetRelation,
} from "../processors/crud-information.js";
import { crudRouteSwitch, structureCrud } from "../processors/crud.js";
import { modelKeyGetPrimary } from "../processors/model-keys.js";
import { JavascriptImportCollector } from "../target/javascript.js";
import {
  crudPartialRouteCreate,
  crudPartialRouteDelete,
  crudPartialRouteList,
  crudPartialRouteSingle,
  crudPartialRouteUpdate,
} from "./partials/routes.js";
import { crudQueryBuilderGet } from "./query-builder.js";

/**
 * Generate the handler implementations that are necessary for CRUD. This currently only
 * works with js and Koa.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function crudHandlersGenerate(generateContext) {
  if (generateContext.options.targetLanguage !== "js") {
    return;
  }

  if (isNil(generateContext.options.generators.router?.target?.library)) {
    return;
  }

  for (const crud of structureCrud(generateContext)) {
    const file = crudHandlersFile(generateContext, crud);

    crudHandlersStart(generateContext, file, crud);

    crudHandlersGenerateForType(generateContext, file, crud);

    crudHandlersEnd(generateContext, file, crud);
  }
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudHandlersFile(generateContext, crud) {
  return fileContextCreateGeneric(generateContext, `${crud.group}/crud.js`, {
    importCollector: new JavascriptImportCollector(),
  });
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudHandlersStart(generateContext, file, crud) {
  const { modifierDocs, modifierDestructure } = crudHandlersGetModifiers(crud);

  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` * `);
  fileWrite(
    file,
    `Register controller implementation for the '${crud.group}' routes.`,
  );
  fileWrite(file, `@param {{`);
  fileContextSetIndent(file, 1);

  fileWrite(file, `sql: Postgres,`);
  fileWrite(file, modifierDocs.join("\n"));

  fileContextSetIndent(file, -1);
  fileWrite(file, `}} options`);
  fileContextRemoveLinePrefix(file, 3);
  fileWrite(file, `*/`);

  fileWrite(file, `export function ${crud.group}RegisterCrud({`);
  fileContextSetIndent(file, 1);

  fileWrite(file, `sql,`);
  fileWrite(file, modifierDestructure.join("\n"));

  fileContextSetIndent(file, -1);
  fileBlockStart(file, `})`);
}

/**
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 * @returns {{
 *   modifierDocs: string[],
 *   modifierDestructure: string[],
 * }}
 */
function crudHandlersGetModifiers(crud) {
  const modifierDocs = [];
  const modifierDestructure = [];

  const model = crudInformationGetModel(crud);
  const relation = crudInformationGetRelation(crud);

  const modelUniqueName =
    upperCaseFirst(model.group) + upperCaseFirst(model.name);

  const crudName =
    crud.group + upperCaseFirst(crudInformationGetName(crud, ""));
  const upperCrudName = upperCaseFirst(crudName);

  if (crudInformationGetHasCustomReadableType(crud)) {
    modifierDocs.push(
      `${crudName}Transform: (entity: QueryResult${modelUniqueName}) => ${upperCaseFirst(
        // @ts-expect-error
        crud.fieldOptions.readableType.reference.group,
      )}${upperCaseFirst(
        // @ts-expect-error
        crud.fieldOptions.readableType.reference.name,
      )},`,
    );
    modifierDestructure.push(`${crudName}Transform,`);
  }

  if (crud.routeOptions.listRoute) {
    modifierDocs.push(
      `${crudName}ListPreModifier?: (event: InsightEvent, ctx: ${upperCrudName}ListCtx, countBuilder: ${modelUniqueName}QueryBuilder, listBuilder: ${modelUniqueName}QueryBuilder) => void|Promise<void>,`,
    );
    modifierDestructure.push(`${crudName}ListPreModifier,`);
  }

  if (crud.routeOptions.singleRoute) {
    modifierDocs.push(
      `${crudName}SinglePreModifier?: (event: InsightEvent, ctx: ${upperCrudName}SingleCtx, singleBuilder: ${modelUniqueName}QueryBuilder) => void|Promise<void>,`,
    );
    modifierDestructure.push(`${crudName}SinglePreModifier,`);
  }

  if (crud.routeOptions.createRoute) {
    modifierDocs.push(
      `${crudName}CreatePreModifier?: (event: InsightEvent, ctx: ${upperCrudName}CreateCtx ${
        relation?.subType === "oneToMany"
          ? ""
          : `, singleBuilder: ${modelUniqueName}QueryBuilder`
      }) => void|Promise<void>,`,
    );
    modifierDestructure.push(`${crudName}CreatePreModifier,`);
  }

  if (crud.routeOptions.updateRoute) {
    modifierDocs.push(
      `${crudName}UpdatePreModifier?: (event: InsightEvent, ctx: ${upperCrudName}SingleCtx, singleBuilder: ${modelUniqueName}QueryBuilder) => void|Promise<void>,`,
    );
    modifierDestructure.push(`${crudName}UpdatePreModifier,`);
  }

  if (crud.routeOptions.deleteRoute) {
    modifierDocs.push(
      `${crudName}DeletePreModifier?: (event: InsightEvent, ctx: ${upperCrudName}SingleCtx, singleBuilder: ${modelUniqueName}QueryBuilder) => void|Promise<void>,`,
    );
    modifierDestructure.push(`${crudName}DeletePreModifier,`);
  }

  for (const nestedCrud of crud.nestedRelations) {
    // @ts-expect-error
    const result = crudHandlersGetModifiers(nestedCrud);
    modifierDocs.push(...result.modifierDocs);
    modifierDestructure.push(...result.modifierDestructure);
  }

  return {
    modifierDocs,
    modifierDestructure,
  };
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudHandlersEnd(generateContext, file, crud) {
  fileWrite(file, `\n${fileFormatInlineComment(file, crud.group)}`);
  fileBlockEnd(file);
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudHandlersGenerateForType(generateContext, file, crud) {
  crudRouteSwitch(
    crud,
    {
      listRoute: crudHandlersList,
      singleRoute: crudHandlersSingle,
      createRoute: crudHandlersCreate,
      updateRoute: crudHandlersUpdate,
      deleteRoute: crudHandlersDelete,
    },
    [generateContext, file, crud],
  );

  for (const nestedCrud of crud.nestedRelations) {
    // @ts-expect-error
    crudHandlersGenerateForType(generateContext, file, nestedCrud);
  }
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudHandlersList(generateContext, file, crud) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);

  const model = crudInformationGetModel(crud);
  const { primaryKeyName } = modelKeyGetPrimary(model);

  const data = {
    handlerName: `${crud.group}Handlers.${crudInformationGetName(
      crud,
      "list",
    )}`,
    crudName: crud.group + upperCaseFirst(crudInformationGetName(crud, "")),
    countBuilder: crudQueryBuilderGet(crud, {
      includeOwnParam: false,
      includeJoins: false,
      traverseParents: true,
      partial: {
        select: [`'${primaryKeyName}'`],
        orderBy: "ctx.validatedBody.orderBy",
        orderBySpec: "ctx.validatedBody.orderBySpec",
      },
    }),
    listBuilder: crudQueryBuilderGet(crud, {
      includeOwnParam: false,
      includeJoins: true,
      traverseParents: false,
      partial: {
        orderBy: "ctx.validatedBody.orderBy",
        orderBySpec: "ctx.validatedBody.orderBySpec",
      },
    }),
    primaryKey: primaryKeyName,
  };

  importCollector.destructure("@compas/stdlib", "newEventFromEvent");
  importCollector.destructure("./events.js", `${data.crudName}Count`);
  importCollector.destructure("./events.js", `${data.crudName}List`);
  importCollector.destructure("./controller.js", `${crud.group}Handlers`);

  if (!crudInformationGetHasCustomReadableType(crud)) {
    importCollector.destructure("./events.js", `${data.crudName}Transform`);
  }

  fileWrite(file, crudPartialRouteList(data));
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudHandlersSingle(generateContext, file, crud) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);

  const model = crudInformationGetModel(crud);
  const { primaryKeyName } = modelKeyGetPrimary(model);

  const data = {
    handlerName: `${crud.group}Handlers.${crudInformationGetName(
      crud,
      "single",
    )}`,
    crudName: crud.group + upperCaseFirst(crudInformationGetName(crud, "")),
    builder: crudQueryBuilderGet(crud, {
      includeOwnParam: true,
      includeJoins: true,
      traverseParents: true,
    }),
    primaryKey: primaryKeyName,
  };

  importCollector.destructure("@compas/stdlib", "newEventFromEvent");
  importCollector.destructure("./events.js", `${data.crudName}Single`);
  importCollector.destructure("./controller.js", `${crud.group}Handlers`);

  if (!crudInformationGetHasCustomReadableType(crud)) {
    importCollector.destructure("./events.js", `${data.crudName}Transform`);
  }

  fileWrite(file, crudPartialRouteSingle(data));
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudHandlersCreate(generateContext, file, crud) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);

  const parent = crudInformationGetParent(crud);
  const relation = crudInformationGetRelation(crud);

  const data = {
    handlerName: `${crud.group}Handlers.${crudInformationGetName(
      crud,
      "create",
    )}`,
    crudName: crud.group + upperCaseFirst(crudInformationGetName(crud, "")),
    applyParams: crud.fromParent
      ? {
          bodyKey: relation.referencedKey,
          paramsKey: crudInformationGetParamName(parent),
        }
      : undefined,
    oneToOneChecks:
      relation?.subType === "oneToOneReverse"
        ? {
            builder: crudQueryBuilderGet(crud, {
              includeOwnParam: true,
              includeJoins: false,
              traverseParents: true,
            }),
          }
        : undefined,
  };

  importCollector.destructure("@compas/stdlib", "newEventFromEvent");
  importCollector.destructure("./events.js", `${data.crudName}Create`);
  importCollector.destructure("./controller.js", `${crud.group}Handlers`);

  if (!crudInformationGetHasCustomReadableType(crud)) {
    importCollector.destructure("./events.js", `${data.crudName}Transform`);
  }

  if (relation?.subType === "oneToOneReverse") {
    importCollector.destructure("@compas/stdlib", "AppError");
  }

  // @ts-expect-error
  fileWrite(file, crudPartialRouteCreate(data));
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudHandlersUpdate(generateContext, file, crud) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);

  const data = {
    handlerName: `${crud.group}Handlers.${crudInformationGetName(
      crud,
      "update",
    )}`,
    crudName: crud.group + upperCaseFirst(crudInformationGetName(crud, "")),
    builder: crudQueryBuilderGet(crud, {
      includeOwnParam: true,
      includeJoins: true,
      traverseParents: true,
    }),
  };

  importCollector.destructure("@compas/stdlib", "newEventFromEvent");
  importCollector.destructure("./events.js", `${data.crudName}Update`);
  importCollector.destructure("./events.js", `${data.crudName}Single`);
  importCollector.destructure("./controller.js", `${crud.group}Handlers`);

  fileWrite(file, crudPartialRouteUpdate(data));
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalCrudDefinition>} crud
 */
function crudHandlersDelete(generateContext, file, crud) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);

  const data = {
    handlerName: `${crud.group}Handlers.${crudInformationGetName(
      crud,
      "delete",
    )}`,
    crudName: crud.group + upperCaseFirst(crudInformationGetName(crud, "")),
    builder: crudQueryBuilderGet(crud, {
      includeOwnParam: true,
      includeJoins: false,
      traverseParents: true,
    }),
  };

  importCollector.destructure("@compas/stdlib", "newEventFromEvent");
  importCollector.destructure("./events.js", `${data.crudName}Delete`);
  importCollector.destructure("./events.js", `${data.crudName}Single`);
  importCollector.destructure("./controller.js", `${crud.group}Handlers`);

  fileWrite(file, crudPartialRouteDelete(data));
}

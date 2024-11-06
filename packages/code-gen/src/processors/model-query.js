import {
  AnyOfType,
  AnyType,
  ArrayType,
  NumberType,
  ObjectType,
  ReferenceType,
} from "../builders/index.js";
import { databaseIsEnabled } from "../database/generator.js";
import { fileWriteRaw } from "../file/write.js";
import { TypescriptImportCollector } from "../target/typescript.js";
import { typesTypescriptResolveFile } from "../types/typescript.js";
import { upperCaseFirst } from "../utils.js";
import {
  modelRelationGetInformation,
  modelRelationGetInverse,
  modelRelationGetOwn,
} from "./model-relation.js";
import { structureModels } from "./models.js";
import { referenceUtilsGetProperty } from "./reference-utils.js";
import { structureAddType } from "./structure.js";

/**
 * Build the 'queryXxx' input types for all models.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelQueryBuilderTypes(generateContext) {
  for (const model of structureModels(generateContext)) {
    const type = new ObjectType(model.group, `${model.name}QueryBuilder`)
      .keys({
        where: new ReferenceType(model.group, `${model.name}Where`).optional(),
        orderBy: new ReferenceType(
          model.group,
          `${model.name}OrderBy`,
        ).optional(),
        orderBySpec: new ReferenceType(
          model.group,
          `${model.name}OrderBySpec`,
        ).optional(),
        limit: new NumberType().min(1).optional(),
        offset: new NumberType().min(0).optional(),
        select: new ReferenceType(
          model.group,
          `${model.name}Returning`,
        ).default(JSON.stringify(Object.keys(model.keys))),
      })
      .build();

    for (const relation of modelRelationGetOwn(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      type.keys[relationInfo.keyNameOwn] = new ReferenceType( // @ts-expect-error
        relationInfo.modelInverse.group,
        `${relationInfo.modelInverse.name}QueryBuilder`,
      )
        .optional()
        .build();
    }

    for (const relation of modelRelationGetInverse(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      type.keys[relationInfo.virtualKeyNameInverse] = new ReferenceType( // @ts-expect-error
        relationInfo.modelOwn.group,
        `${relationInfo.modelOwn.name}QueryBuilder`,
      )
        .optional()
        .build();
    }

    structureAddType(generateContext.structure, type, {
      skipReferenceExtraction: true,
    });
  }
}

/**
 * Build the 'xxxQueryResult' output types for all models.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelQueryResultTypes(generateContext) {
  for (const model of structureModels(generateContext)) {
    const expansionType = new ObjectType(
      "queryExpansion",
      model.group + upperCaseFirst(model.name),
    )
      .keys({})
      .build();

    const type = new ObjectType(
      "queryResult",
      model.group + upperCaseFirst(model.name),
    )
      .keys({})
      .build();

    type.keys = {
      ...model.keys,
    };

    for (const relation of modelRelationGetOwn(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      const existingType = type.keys[relationInfo.keyNameOwn];
      const isOptional = referenceUtilsGetProperty(
        generateContext,
        type.keys[relationInfo.keyNameOwn],
        ["isOptional"],
      );

      const joinedType = new ReferenceType(
        "queryResult",
        `${relationInfo.modelInverse.group}${upperCaseFirst(
          relationInfo.modelInverse.name,
        )}`,
      ).build();

      const anyOfType = new AnyOfType().values(true);
      if (isOptional) {
        anyOfType.optional();
      }

      type.keys[relationInfo.keyNameOwn] = anyOfType.build();
      type.keys[relationInfo.keyNameOwn].values = [existingType, joinedType];

      const joinedExpansionType = getQueryDefinitionReference(
        relationInfo.modelInverse.group,
        relationInfo.modelInverse.name,
      );
      if (isOptional) {
        joinedExpansionType.optional();
      }

      expansionType.keys[relationInfo.keyNameOwn] = joinedExpansionType.build();
    }

    for (const relation of modelRelationGetInverse(model)) {
      const relationInfo = modelRelationGetInformation(relation);

      const joinedType =
        relation.subType === "oneToMany" ?
          new ArrayType().values(
            new ReferenceType(
              "queryResult",
              `${relationInfo.modelOwn.group}${upperCaseFirst(
                relationInfo.modelOwn.name,
              )}`,
            ),
          )
        : new ReferenceType(
            "queryResult",
            `${relationInfo.modelOwn.group}${upperCaseFirst(relationInfo.modelOwn.name)}`,
          );

      type.keys[relationInfo.virtualKeyNameInverse] = joinedType
        .optional()
        .build();

      const joinedExpansionType =
        relation.subType === "oneToMany" ?
          new ArrayType().values(
            getQueryDefinitionReference(
              relationInfo.modelOwn.group,
              relationInfo.modelOwn.name,
            ),
          )
        : getQueryDefinitionReference(
            relationInfo.modelOwn.group,
            relationInfo.modelOwn.name,
          );

      expansionType.keys[relationInfo.virtualKeyNameInverse] =
        joinedExpansionType.optional().build();
    }

    structureAddType(generateContext.structure, type, {
      skipReferenceExtraction: true,
    });
    structureAddType(generateContext.structure, expansionType, {
      skipReferenceExtraction: true,
    });
  }
}

function getQueryDefinitionReference(group, name) {
  const resolvedName = `${upperCaseFirst(group)}${upperCaseFirst(name)}`;

  const implementation = {
    validatorInputType: `QueryDefinition${resolvedName}`,
    validatorOutputType: `QueryDefinition${resolvedName}`,
  };
  return new AnyType().implementations({
    js: implementation,
    ts: implementation,
    jsPostgres: implementation,
    tsPostgres: implementation,
  });
}

/**
 * Add raw types related to models and query builders
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {void}
 */
export function modelQueryRawTypes(generateContext) {
  if (!databaseIsEnabled(generateContext)) {
    return;
  }

  const file = typesTypescriptResolveFile(generateContext);

  if (generateContext.options.targetLanguage === "ts") {
    const typeImports = TypescriptImportCollector.getImportCollector(
      file,
      true,
    );
    typeImports.destructure("@compas/store", "QueryBuilderResolver");
    typeImports.destructure("@compas/store", "QueryBuilderDefinition");
    typeImports.destructure("@compas/store", "ResolveOptionalJoins");
  }

  const exportPrefix =
    generateContext.options.generators.types?.declareGlobalTypes ?
      ""
    : "export";

  for (const model of structureModels(generateContext)) {
    const name = `${upperCaseFirst(model.group)}${upperCaseFirst(model.name)}`;

    if (generateContext.options.targetLanguage === "ts") {
      fileWriteRaw(
        file,
        `${exportPrefix} type QueryDefinition${name} = QueryBuilderDefinition<${name}, QueryExpansion${name}>;\n`,
      );
      fileWriteRaw(
        file,
        `${exportPrefix} type ${name}QueryResolver<QueryBuilder extends ${name}QueryBuilderInput, const OptionalJoins extends ResolveOptionalJoins<QueryExpansion${name}> = never> = QueryBuilderResolver<QueryDefinition${name}, QueryBuilder, OptionalJoins>;\n\n`,
      );
    } else if (generateContext.options.targetLanguage === "js") {
      fileWriteRaw(
        file,
        `${exportPrefix} type QueryDefinition${name} = import("@compas/store").QueryBuilderDefinition<${name}, QueryExpansion${name}>;\n`,
      );
      fileWriteRaw(
        file,
        `${exportPrefix} type ${name}QueryResolver<QueryBuilder extends ${name}QueryBuilderInput, const OptionalJoins extends import("@compas/store").ResolveOptionalJoins<QueryExpansion${name}> = never> = import("@compas/store").QueryBuilderResolver<QueryDefinition${name}, QueryBuilder, OptionalJoins>;\n\n`,
      );
    }
  }
}

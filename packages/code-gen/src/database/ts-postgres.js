import { isNil } from "@compas/stdlib";
import { fileBlockEnd, fileBlockStart } from "../file/block.js";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextRemoveLinePrefix,
  fileContextSetIndent,
} from "../file/context.js";
import { fileFormatInlineComment } from "../file/docs.js";
import { fileWrite, fileWriteInline } from "../file/write.js";
import { modelKeyGetPrimary } from "../processors/model-keys.js";
import {
  modelRelationGetInformation,
  modelRelationGetInverse,
  modelRelationGetOwn,
} from "../processors/model-relation.js";
import { modelWhereGetInformation } from "../processors/model-where.js";
import { structureModels } from "../processors/models.js";
import { referenceUtilsGetProperty } from "../processors/reference-utils.js";
import { structureResolveReference } from "../processors/structure.js";
import { JavascriptImportCollector } from "../target/javascript.js";
import { upperCaseFirst } from "../utils.js";

/**
 * Generate a utils file that can be used by other generators.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function tsPostgresGenerateUtils(generateContext) {
  const helperFile = fileContextCreateGeneric(
    generateContext,
    "common/database-helpers.ts",
    {
      importCollector: new JavascriptImportCollector(),
      typeImportCollector: new JavascriptImportCollector(true),
    },
  );

  const indexFile = fileContextCreateGeneric(
    generateContext,
    "common/database.js",
    {
      importCollector: new JavascriptImportCollector(),
      typeImportCollector: new JavascriptImportCollector(true),
    },
  );

  const helperImportCollector =
    JavascriptImportCollector.getImportCollector(helperFile);
  const helperTypeImportCollector =
    JavascriptImportCollector.getImportCollector(helperFile, true);

  const indexImportCollector =
    JavascriptImportCollector.getImportCollector(indexFile);

  helperImportCollector.destructure("@compas/stdlib", "AppError");
  helperTypeImportCollector.destructure("@compas/store", "QueryPart");
  helperTypeImportCollector.destructure("@compas/store", "WrappedQueryPart");
  helperTypeImportCollector.destructure("@compas/store", "WrappedQueryResult");

  fileWrite(
    helperFile,
    `
type Either<T, E> = { value: T; error?: never }|{ value?: never; error: E };
    
/**
 * Wrap a queryPart & validator in something that can either be used directly, or can be chained.
 */
export function wrapQueryPart<T extends (input: unknown) => Either<unknown, unknown>>(queryPart: QueryPart, validator: T, options: { hasCustomReturning: boolean }): WrappedQueryPart<NonNullable<ReturnType<T>["value"]>> {
  return {
    queryPart,
    then: () => {
      throw AppError.serverError({
        message:
          "Awaited a wrapped query part directly. Please use '.exec' or '.execRaw'.",
      });
    },
    exec: async (sql: Postgres) => {
      if (options.hasCustomReturning) {
        throw AppError.serverError({
          message: "A custom value for the returned columns is used. This can't be used with '.exec', because it validates the full model. Please use '.execRaw' instead.",
        });
      }
    
      const queryResult = await queryPart.exec(sql);
      const validatedResult = Array.from({ length: queryResult.length });
      
      for (let i = 0; i < queryResult.length; ++i) {
        const { error, value } = validator(queryResult[i]);
        
        if (error) {
          throw AppError.serverError({
            message: "Database result did not pass the validators. When 'select' is used, you may want to use '.execRaw(sql)' instead of '.exec(sql)'.",
            validator: validator.name,
            error,
            databaseValue: queryResult[i],
          });
        }
        
        validatedResult[i] = value;
      }
      
      return validatedResult;
    },
    execRaw: async (sql: Postgres) => await queryPart.exec(sql),
  } as any;
}
`,
  );

  fileWrite(
    indexFile,
    `
export const queries = {
${structureModels(generateContext)
  .map((it) => {
    indexImportCollector.destructure(
      `../database/${it.name}.js`,
      `${it.name}Queries`,
    );

    return `  ...${it.name}Queries,`;
  })
  .join("\n")}
};
`,
  );
}

/**
 * Create a file for the provided model
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>} model
 * @returns {import("../file/context.js").GenerateFile}
 */
export function tsPostgresCreateFile(generateContext, model) {
  const file = fileContextCreateGeneric(
    generateContext,
    `database/${model.name}.ts`,
    {
      importCollector: new JavascriptImportCollector(),
      typeImportCollector: new JavascriptImportCollector(true),
    },
  );

  const importCollector = JavascriptImportCollector.getImportCollector(file);
  const typeImportCollector = JavascriptImportCollector.getImportCollector(
    file,
    true,
  );

  importCollector.destructure("../common/database-helpers.js", "wrapQueryPart");
  importCollector.destructure("@compas/store", "query");
  importCollector.destructure("@compas/store", "generatedWhereBuilderHelper");
  importCollector.destructure("@compas/store", "generatedUpdateHelper");
  importCollector.destructure("@compas/stdlib", "isNil");
  importCollector.destructure("@compas/stdlib", "AppError");

  typeImportCollector.destructure("@compas/store", "Postgres");
  typeImportCollector.destructure("@compas/store", "QueryPart");
  typeImportCollector.destructure("@compas/store", "WrappedQueryPart");
  typeImportCollector.destructure("@compas/store", "WrappedQueryResult");

  fileWrite(file, `\nexport const ${model.name}Queries = {`);
  fileContextSetIndent(file, 1);

  if (model.queryOptions?.isView) {
    fileWrite(file, `${model.name}Count,`);
  } else {
    fileWrite(file, `${model.name}Count,`);
    fileWrite(file, `${model.name}Insert,`);
    fileWrite(file, `${model.name}Update,`);
    fileWrite(file, `${model.name}Delete,`);
    fileWrite(
      file,
      `${model.name}UpsertOn${upperCaseFirst(modelKeyGetPrimary(model).primaryKeyName)},`,
    );
  }

  fileContextSetIndent(file, -1);
  fileWrite(file, `};\n`);

  return file;
}

/**
 * Generate the where query function and specification
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function tsPostgresGenerateWhere(
  generateContext,
  file,
  model,
  contextNames,
) {
  const whereInformation = modelWhereGetInformation(model);
  const ownRelations = modelRelationGetOwn(model);
  const inverseRelations = modelRelationGetInverse(model);

  const importCollector = JavascriptImportCollector.getImportCollector(file);

  const fieldSpecs = {};

  // TODO: abstract this logic in the generator, instead of here.
  for (const info of whereInformation.fields) {
    const fieldType =
      model.keys[info.modelKey].type === "reference" ?
        structureResolveReference(
          generateContext.structure,
          model.keys[info.modelKey],
        )?.type
      : model.keys[info.modelKey].type;
    const isFloat =
      fieldType === "number" &&
      referenceUtilsGetProperty(
        generateContext,
        model.keys[info.modelKey],
        ["validator", "floatingPoint"],
        false,
      );

    const dateOnly =
      fieldType === "date" && // @ts-expect-error
      model.keys[info.modelKey].specifier === "date";
    const timeOnly =
      fieldType === "date" && // @ts-expect-error
      model.keys[info.modelKey].specifier === "time";

    if (isNil(fieldSpecs[info.modelKey])) {
      fieldSpecs[info.modelKey] = {
        tableKey: info.modelKey,
        keyType:
          fieldType === "number" && !isFloat ? "int"
          : fieldType === "number" && isFloat ? "float"
          : fieldType === "string" ? "varchar"
          : fieldType === "date" && dateOnly ? "date"
          : fieldType === "date" && timeOnly ? "time"
          : fieldType === "date" ? "timestamptz"
          : "uuid",
        matchers: [],
      };
    }

    fieldSpecs[info.modelKey].matchers.push({
      matcherKey: info.whereKey,
      matcherType: info.variant,
    });
  }

  for (const relation of ownRelations) {
    const relationInfo = modelRelationGetInformation(relation);

    const isSelfReferencing =
      relationInfo.modelOwn === relationInfo.modelInverse;

    if (!isSelfReferencing) {
      importCollector.destructure(
        `./${relationInfo.modelInverse.name}.js`,
        `${relationInfo.modelInverse.name}WhereSpec`,
      );
    }

    // The own key already exists on the spec since it is a real field.
    fieldSpecs[relationInfo.keyNameOwn].matchers.push({
      matcherKey: `via${upperCaseFirst(relationInfo.keyNameOwn)}`,
      matcherType: "via",
      relation: {
        entityName: relationInfo.modelInverse.name,
        shortName: `${relationInfo.modelInverse.shortName}${
          isSelfReferencing ? "2" : ""
        }`,
        entityKey: relationInfo.primaryKeyNameInverse,
        referencedKey: relationInfo.keyNameOwn,
        where: `$$(): any => ${relationInfo.modelInverse.name}WhereSpec$$`,
      },
    });
  }

  for (const relation of inverseRelations) {
    const relationInfo = modelRelationGetInformation(relation);

    const isSelfReferencing =
      relationInfo.modelOwn === relationInfo.modelInverse;

    if (!isSelfReferencing) {
      importCollector.destructure(
        `./${relationInfo.modelOwn.name}.js`,
        `${relationInfo.modelOwn.name}WhereSpec`,
      );
    }

    fieldSpecs[relationInfo.virtualKeyNameInverse] = {
      tableKey: relationInfo.virtualKeyNameInverse,
      matchers: [
        {
          matcherKey: `via${upperCaseFirst(relationInfo.virtualKeyNameInverse)}`,
          matcherType: "via",
          relation: {
            entityName: relationInfo.modelOwn.name,
            shortName: `${relationInfo.modelOwn.shortName}${
              isSelfReferencing ? "2" : ""
            }`,
            entityKey: relationInfo.keyNameOwn,
            referencedKey: relationInfo.primaryKeyNameInverse,
            where: `$$(): any => ${relationInfo.modelOwn.name}WhereSpec$$`,
          },
        },
        {
          matcherKey: `${relationInfo.virtualKeyNameInverse}NotExists`,
          matcherType: "notExists",
          relation: {
            entityName: relationInfo.modelOwn.name,
            shortName: `${relationInfo.modelOwn.shortName}${
              isSelfReferencing ? "2" : ""
            }`,
            entityKey: relationInfo.keyNameOwn,
            referencedKey: relationInfo.primaryKeyNameInverse,
            where: `$$(): any => ${relationInfo.modelOwn.name}WhereSpec$$`,
          },
        },
      ],
    };
  }

  fileWrite(
    file,
    `export const ${model.name}WhereSpec = ${JSON.stringify(
      {
        fieldSpecification: Object.values(fieldSpecs),
      },
      null,
      2,
    )
      .replaceAll(`"$$`, "")
      .replaceAll(`$$"`, "")};\n`,
  );

  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, " *");

  fileWrite(
    file,
    " Reusable where clause generator. This is used by other generated queries, and can be used inline in custom queries.",
  );
  fileWrite(file, `/`);

  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `export function ${model.name}Where(where: ${contextNames.whereType.inputType}, options: { skipValidator?: boolean, shortName?: string } = {}): QueryPart`,
  );

  fileWrite(file, `options.shortName ??= "${model.shortName}."`);
  fileWrite(
    file,
    `if (!options.shortName.endsWith(".")) { options.shortName += "."; }`,
  );

  fileBlockStart(file, `if (!options.skipValidator)`);

  fileWrite(
    file,
    `const { error, value } = ${contextNames.whereType.validatorFunction}(where ?? {});`,
  );

  fileBlockStart(file, `if (error)`);
  fileWrite(
    file,
    `throw AppError.serverError({ message: "Invalid where object", error, });`,
  );
  fileBlockEnd(file);

  fileWrite(file, `where = value`);

  fileBlockEnd(file);

  fileWrite(
    file,
    `return generatedWhereBuilderHelper(${model.name}WhereSpec as any, where ?? {}, options.shortName);`,
  );

  fileBlockEnd(file);
  fileWrite(file, "");
}

/**
 * Generate the order by query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function tsPostgresGenerateOrderBy(
  generateContext,
  file,
  model,
  contextNames,
) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);
  importCollector.destructure("@compas/store", "isQueryPart");

  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, " *");

  fileWrite(
    file,
    " Reusable ORDER BY clause generator. This is used by other generated queries, and can be used inline in custom queries.",
  );
  fileWrite(file, `/`);

  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `export function ${model.name}OrderBy(orderBy?: ${contextNames.orderByType.inputType}, orderBySpec?: ${contextNames.orderBySpecType.inputType}, options: { skipValidator?: boolean, shortName?: string } = {}): QueryPart`,
  );

  fileWrite(file, `options.shortName ??= "${model.shortName}."`);
  fileWrite(
    file,
    `if (!options.shortName.endsWith(".")) { options.shortName += "."; }`,
  );

  const orderByArray =
    model.queryOptions?.withDates || model.queryOptions?.withSoftDeletes ?
      ["createdAt", "updatedAt", modelKeyGetPrimary(model).primaryKeyName]
    : [modelKeyGetPrimary(model).primaryKeyName];

  fileWrite(file, `orderBy ??= ${JSON.stringify(orderByArray)};`);
  fileWrite(file, `orderBySpec ??= {};`);

  fileBlockStart(file, `if (!options.skipValidator)`);

  fileWrite(
    file,
    `const validatedOrderBy = ${contextNames.orderByType.validatorFunction}(orderBy);`,
  );

  fileBlockStart(file, `if (validatedOrderBy.error)`);
  fileWrite(
    file,
    `throw AppError.serverError({ message: "Invalid orderBy array", error: validatedOrderBy.error, });`,
  );
  fileBlockEnd(file);

  fileWrite(file, `orderBy = validatedOrderBy.value;`);

  fileWrite(
    file,
    `const validatedOrderBySpec = ${contextNames.orderBySpecType.validatorFunction}(orderBySpec);`,
  );

  fileBlockStart(file, `if (validatedOrderBySpec.error)`);
  fileWrite(
    file,
    `throw AppError.serverError({ message: "Invalid orderBySpec object", error: validatedOrderBySpec.error, });`,
  );
  fileBlockEnd(file);

  fileWrite(file, `orderBySpec = validatedOrderBySpec.value;`);

  fileBlockEnd(file);

  fileBlockStart(file, `if (isQueryPart(orderBy))`);
  fileWrite(file, `return orderBy`);
  fileBlockEnd(file);

  fileWrite(file, `let str = "";`);

  fileBlockStart(file, `for (const value of orderBy)`);

  fileBlockStart(file, `if(str.length !== 0)`);
  fileWrite(file, `str += ", ";`);
  fileBlockEnd(file);

  fileWrite(
    file,
    `str += \`$\{options.shortName}"$\{value}" $\{orderBySpec[value] ?? "ASC"}\``,
  );

  fileBlockEnd(file);

  fileWrite(file, `return query([str]);`);

  fileBlockEnd(file);
  fileWrite(file, "");
}

/**
 * Generate the count query function. This is the only result that doesn't return a
 * wrapped query part.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function tsPostgresGenerateCount(
  generateContext,
  file,
  model,
  contextNames,
) {
  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);
  fileWrite(file, ` Count the records in the '${model.name}' table\n`);
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `async function ${model.name}Count(sql: Postgres, where: ${contextNames.whereType.inputType}): Promise<number>`,
  );

  fileWrite(
    file,
    `const [result] = await query<Array<{ recordCount: number }>>\`select count(${model.shortName}."${
      modelKeyGetPrimary(model).primaryKeyName
    }") as "recordCount" FROM ${model.queryOptions?.schema}"${model.name}" ${
      model.shortName
    } WHERE $\{${model.name}Where(where)}\`.exec(sql);`,
  );

  fileWrite(file, `return Number(result?.recordCount ?? "0");`);

  fileBlockEnd(file);
  fileWrite(file, "");
}

/**
 * Generate the insert query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function tsPostgresGenerateInsert(
  generateContext,
  file,
  model,
  contextNames,
) {
  // TODO(future): remove compat wrapper

  // Compatibility wrapper with existing code-gen
  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);
  fileWrite(file, ` Insert a record in the '${model.name}' table\n`);
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `function ${model.name}Insert(sql: Postgres, insert: ${contextNames.insertType.inputType}["insert"], _options: { withPrimaryKey?: boolean } = {}): Promise<${contextNames.model.outputType}[]>`,
  );

  fileBlockStart(
    file,
    `if (insert === undefined || (Array.isArray(insert) && insert.length === 0))`,
  );

  fileWrite(file, `return Promise.resolve([]);`);
  fileBlockEnd(file);

  fileWrite(
    file,
    `return ${model.name}InsertInternal({ insert, returning: "*" }).exec(sql);`,
  );
  fileBlockEnd(file);
  fileWrite(file, "");

  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);
  fileWrite(file, ` Insert a record in the '${model.name}' table\n`);
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `function ${model.name}InsertInternal(input: ${contextNames.insertType.inputType}): WrappedQueryPart<${contextNames.model.outputType}>`,
  );

  // Input validation
  fileWrite(
    file,
    `const { error, value: validatedInput } = ${contextNames.insertType.validatorFunction}(input);`,
  );
  fileBlockStart(file, `if (error)`);
  fileWrite(
    file,
    `throw AppError.serverError({
  message: "Insert input validation failed",
  error,
});`,
  );
  fileBlockEnd(file);

  fileWrite(file, `const qb = query\``);
  fileWrite(file, `INSERT INTO ${model.queryOptions?.schema}"${model.name}"`);
  fileContextSetIndent(file, 1);
  fileWrite(file, `(${JSON.stringify(Object.keys(model.keys)).slice(1, -1)})`);
  fileContextSetIndent(file, -1);
  fileWrite(file, `VALUES`);
  fileWrite(file, `\`;`);

  fileWrite(file, `/** @type {string[]} */`);
  fileWrite(file, `const str = [];`);
  fileWrite(file, `const args = [];`);

  fileBlockStart(file, `for (const insert of validatedInput.insert)`);
  fileBlockStart(file, `if (str.length)`);
  fileWrite(file, `str.push(", (");`);
  fileBlockEnd(file);

  fileBlockStart(file, "else");
  fileWrite(file, `str.push("(");`);
  fileBlockEnd(file);

  for (const key of Object.keys(model.keys)) {
    const field = model.keys[key];
    const hasSqlDefault = referenceUtilsGetProperty(generateContext, field, [
      "sql",
      "hasDefaultValue",
    ]);
    const isPrimary = referenceUtilsGetProperty(generateContext, field, [
      "sql",
      "primary",
    ]);
    const fieldType =
      field.type === "reference" ?
        structureResolveReference(generateContext.structure, field).type
      : field.type;

    const isPrimitive = [
      "boolean",
      "date",
      "number",
      "string",
      "uuid",
    ].includes(fieldType);

    if (hasSqlDefault || isPrimary) {
      // Insert for fields that are Postgres only optional.

      fileBlockStart(file, `if (isNil(insert.${key}))`);
      fileWrite(file, `args.push(undefined);`);
      fileWrite(file, `str.push("DEFAULT, ");`);
      fileBlockEnd(file);

      fileBlockStart(file, "else");

      if (isPrimitive) {
        fileWrite(file, `args.push(insert.${key});`);
      } else {
        fileWrite(file, `args.push(JSON.stringify(insert.${key}));`);
      }
      fileWrite(file, `str.push(", ")`);

      fileBlockEnd(file);
    } else {
      if (isPrimitive) {
        fileWrite(file, `args.push(insert.${key} ?? null);`);
      } else {
        fileBlockStart(file, `if (!isNil(insert.${key}))`);
        fileWrite(file, `args.push(JSON.stringify(insert.${key}));`);
        fileBlockEnd(file);

        fileBlockStart(file, "else");
        fileWrite(file, `args.push(null);`);
        fileBlockEnd(file);
      }
      fileWrite(file, `str.push(", ");`);
    }
  }

  fileWrite(
    file,
    fileFormatInlineComment(
      file,
      "We have added an extra comma, so remove it.",
    ),
  );
  fileWrite(file, `str[str.length -1] = str.at(-1)?.slice(0, -2) ?? "";`);
  fileWrite(file, `args.push(undefined);`);

  fileWrite(file, `str.push(")");`);
  fileWrite(file, `args.push(undefined);`);

  fileBlockEnd(file);

  fileBlockStart(file, `if(validatedInput.returning === "*")`);
  fileWrite(
    file,
    `str.push(\` RETURNING ${JSON.stringify(Object.keys(model.keys)).slice(1, -1)}\`);`,
  );
  fileWrite(file, `args.push(undefined);`);
  fileBlockEnd(file);

  fileBlockStart(file, `else if (Array.isArray(validatedInput.returning))`);
  fileWrite(
    file,
    `str.push(\` RETURNING $\{JSON.stringify(validatedInput.returning).slice(1, -1)}\`);`,
  );
  fileWrite(file, `args.push(undefined);`);
  fileBlockEnd(file);

  fileWrite(file, `qb.append(query(str, ...args));`);
  fileWrite(
    file,
    `return wrapQueryPart(qb, ${contextNames.model.validatorFunction}, { hasCustomReturning: Array.isArray(validatedInput.returning), });`,
  );

  fileBlockEnd(file);
  fileWrite(file, "");
}

/**
 * Generate the upsert on primary key query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function tsPostgresGenerateUpsertOnPrimaryKey(
  generateContext,
  file,
  model,
  contextNames,
) {
  // TODO(future): remove compat wrapper

  // Compatibility wrapper with existing code-gen
  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);
  fileWrite(file, ` Upsert a record in the '${model.name}' table\n`);
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `function ${model.name}UpsertOn${upperCaseFirst(
      modelKeyGetPrimary(model).primaryKeyName,
    )}(sql: Postgres, insert: ${contextNames.insertType.inputType}["insert"]): Promise<${contextNames.model.outputType}[]>`,
  );
  fileWrite(
    file,
    `return ${model.name}UpsertOn${upperCaseFirst(
      modelKeyGetPrimary(model).primaryKeyName,
    )}Internal({ insert, returning: "*" }).exec(sql);`,
  );
  fileBlockEnd(file);
  fileWrite(file, "");

  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);

  fileWrite(
    file,
    ` Upsert a record in the '${model.name}' table based on the primary key.\n`,
  );
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `function ${model.name}UpsertOn${upperCaseFirst(
      modelKeyGetPrimary(model).primaryKeyName,
    )}Internal(input: ${contextNames.insertType.inputType}): WrappedQueryPart<${contextNames.model.outputType}>`,
  );

  // Input validation
  fileWrite(
    file,
    `const { error, value: validatedInput } = ${contextNames.insertType.validatorFunction}(input);`,
  );
  fileBlockStart(file, `if (error)`);
  fileWrite(
    file,
    `throw AppError.serverError({
  message: "Insert input validation failed",
  error,
});`,
  );
  fileBlockEnd(file);

  fileWrite(
    file,
    `const { queryPart } = ${model.name}InsertInternal({ insert: input.insert });`,
  );

  fileWrite(file, `/** @type {string[]} */`);
  fileWrite(file, `const str = [];`);
  fileWrite(file, `const args = []`);

  fileWrite(
    file,
    `str.push(\`ON CONFLICT ("${
      modelKeyGetPrimary(model).primaryKeyName
    }") DO UPDATE SET`,
  );
  fileContextSetIndent(file, 1);

  let isFirst = true;
  for (const key of Object.keys(model.keys)) {
    const isPrimary = referenceUtilsGetProperty(
      generateContext,
      model.keys[key],
      ["sql", "primary"],
    );

    if (isPrimary) {
      continue;
    }

    if (
      (model.queryOptions?.withDates || model.queryOptions?.withSoftDeletes) &&
      key === "createdAt"
    ) {
      // Don't alter the original createdAt field.
      continue;
    }

    if (!isFirst) {
      fileWrite(file, `,`);
    } else {
      isFirst = false;
    }

    fileWriteInline(
      file,
      `"${key}" = COALESCE(EXCLUDED."${key}", "${model.name}"."${key}")`,
    );
  }

  fileContextSetIndent(file, -1);
  fileWrite(file, `\`);`);

  fileBlockStart(file, `if(validatedInput.returning === "*")`);
  fileWrite(
    file,
    `str.push(\` RETURNING ${JSON.stringify(Object.keys(model.keys)).slice(1, -1)}\`);`,
  );
  fileWrite(file, `args.push(undefined);`);
  fileBlockEnd(file);

  fileBlockStart(file, `else if (Array.isArray(validatedInput.returning))`);
  fileWrite(
    file,
    `str.push(\` RETURNING $\{JSON.stringify(validatedInput.returning).slice(1, -1)}\`);`,
  );
  fileWrite(file, `args.push(undefined);`);
  fileBlockEnd(file);

  fileWrite(file, `queryPart.append(query(str, ...args));`);
  fileWrite(
    file,
    `return wrapQueryPart(queryPart, ${contextNames.model.validatorFunction}, { hasCustomReturning: Array.isArray(validatedInput.returning), });`,
  );

  fileBlockEnd(file);
  fileWrite(file, "");
}

/**
 * Generate the update query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function tsPostgresGenerateUpdate(
  generateContext,
  file,
  model,
  contextNames,
) {
  // Generate the spec
  const entityUpdateSpec = {
    schemaName: model.queryOptions?.schema,
    name: model.name,
    shortName: model.shortName,
    columns: Object.keys(model.keys),
    where: `$$${model.name}WhereSpec$$`,
    injectUpdatedAt:
      model.queryOptions?.withDates ??
      model.queryOptions?.withSoftDeletes ??
      false,
    fields: {},
  };

  for (const key of Object.keys(model.keys)) {
    const type =
      model.keys[key].type === "reference" ?
        structureResolveReference(generateContext.structure, model.keys[key])
          .type
      : model.keys[key].type;

    const subType =
      ["number", "boolean", "string", "date", "uuid"].includes(type) ? type : (
        "jsonb"
      );

    entityUpdateSpec.fields[key] = {
      type: subType,
      atomicUpdates: [],
    };

    if (type === "number") {
      entityUpdateSpec.fields[key].atomicUpdates = [
        "$add",
        "$subtract",
        "$multiply",
        "$divide",
      ];
    } else if (type === "date") {
      entityUpdateSpec.fields[key].atomicUpdates = ["$add", "$subtract"];
    } else if (type === "string") {
      entityUpdateSpec.fields[key].atomicUpdates = ["$append"];
    } else if (type === "boolean") {
      entityUpdateSpec.fields[key].atomicUpdates = ["$negate"];
    } else if (subType === "jsonb") {
      entityUpdateSpec.fields[key].atomicUpdates = ["$set", "$remove"];
    }
  }

  fileWrite(
    file,
    `const ${model.name}UpdateSpec = ${JSON.stringify(entityUpdateSpec, null, 2)
      .replaceAll(`"$$`, "")
      .replaceAll(`$$"`, "")};\n`,
  );

  // TODO(future): remove compat wrapper

  // Compatibility wrapper with existing code-gen
  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);
  fileWrite(file, ` Insert a record in the '${model.name}' table\n`);
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `function ${model.name}Update(sql: Postgres, update: ${contextNames.updateType.inputType}): Promise<${contextNames.model.outputType}[]>`,
  );
  fileBlockStart(file, `if (update?.returning === "*" || !update?.returning)`);
  fileWrite(file, `return ${model.name}UpdateInternal(update).exec(sql);`);
  fileBlockEnd(file);
  fileWrite(file, `// @ts-expect-error`);
  fileWrite(file, `return ${model.name}UpdateInternal(update).execRaw(sql);`);
  fileBlockEnd(file);
  fileWrite(file, "");

  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);
  fileWrite(file, ` Update records in the '${model.name}' table\n`);
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `function ${model.name}UpdateInternal(input: ${contextNames.updateType.inputType}): WrappedQueryPart<${contextNames.model.outputType}>`,
  );

  // Input validation
  fileWrite(
    file,
    `const { error, value: validatedInput } = ${contextNames.updateType.validatorFunction}(input);`,
  );
  fileBlockStart(file, `if (error)`);
  fileWrite(
    file,
    `throw AppError.serverError({
  message: "Update input validation failed",
  error,
});`,
  );
  fileBlockEnd(file);

  fileWrite(
    file,
    `return wrapQueryPart(generatedUpdateHelper(${model.name}UpdateSpec as any, validatedInput), ${contextNames.model.validatorFunction}, { hasCustomReturning: Array.isArray(validatedInput.returning), });`,
  );

  fileBlockEnd(file);
  fileWrite(file, "");
}

/**
 * Generate the delete query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function tsPostgresGenerateDelete(
  generateContext,
  file,
  model,
  contextNames,
) {
  // TODO(future): remove compat wrapper

  // Compatibility wrapper with existing code-gen
  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);

  fileWrite(file, ` Remove a record from the '${model.name}' table\n`);
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `function ${model.name}Delete(sql: Postgres, where: ${contextNames.whereType.inputType} = {}): Promise<void>`,
  );
  fileWrite(file, `return ${model.name}DeleteInternal(where).exec(sql);`);
  fileBlockEnd(file);
  fileWrite(file, "");

  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);
  fileWrite(file, ` Remove records from the '${model.name}' table\n`);
  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `function ${model.name}DeleteInternal(where: ${contextNames.whereType.inputType} = {}): QueryPart`,
  );

  if (model.queryOptions?.withSoftDeletes) {
    fileWrite(file, `where.deletedAtIncludeNotNull = true;`);
  }

  fileWrite(
    file,
    `return query\`DELETE FROM ${model.queryOptions?.schema}"${model.name}" ${model.shortName} WHERE $\{${model.name}Where(where)}\`;`,
  );

  fileBlockEnd(file);
  fileWrite(file, "");
}

/**
 * Generate the query builder spec and wrapper function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<import("../generated/common/types.d.ts").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function tsPostgresGenerateQueryBuilder(
  generateContext,
  file,
  model,
  contextNames,
) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);
  importCollector.destructure("@compas/store", "generatedQueryBuilderHelper");

  // Generate the spec
  const entityQuerySpec = {
    name: model.name,
    shortName: model.shortName,
    orderByExperimental: `$$${model.name}OrderBy$$`,
    where: `$$${model.name}WhereSpec$$`,
    columns: Object.keys(model.keys),
    relations: [],
  };

  const ownRelations = modelRelationGetOwn(model);
  const inverseRelations = modelRelationGetInverse(model);

  for (const relation of ownRelations) {
    const relationInfo = modelRelationGetInformation(relation);

    if (relationInfo.modelOwn !== relationInfo.modelInverse) {
      importCollector.destructure(
        `./${relationInfo.modelInverse.name}.js`,
        `${relationInfo.modelInverse.name}QueryBuilderSpec`,
      );
    }

    // @ts-expect-error
    entityQuerySpec.relations.push({
      builderKey: relationInfo.keyNameOwn,
      ownKey: relationInfo.keyNameOwn,
      referencedKey: relationInfo.primaryKeyNameInverse,
      returnsMany: false,
      entityInformation: `$$(): any => ${relationInfo.modelInverse.name}QueryBuilderSpec$$`,
    });
  }

  const fullTypeName = `${upperCaseFirst(model.group)}${upperCaseFirst(model.name)}`;

  for (const relation of inverseRelations) {
    const relationInfo = modelRelationGetInformation(relation);

    if (relationInfo.modelOwn !== relationInfo.modelInverse) {
      importCollector.destructure(
        `./${relationInfo.modelOwn.name}.js`,
        `${relationInfo.modelOwn.name}QueryBuilderSpec`,
      );
    }

    // @ts-expect-error
    entityQuerySpec.relations.push({
      builderKey: relationInfo.virtualKeyNameInverse,
      ownKey: relationInfo.primaryKeyNameInverse,
      referencedKey: relationInfo.keyNameOwn,
      returnsMany: relation.subType === "oneToMany",
      entityInformation: `$$(): any => ${relationInfo.modelOwn.name}QueryBuilderSpec$$`,
    });
  }

  fileWrite(
    file,
    `export const ${model.name}QueryBuilderSpec = ${JSON.stringify(
      entityQuerySpec,
      null,
      2,
    )
      .replaceAll(`"$$`, "")
      .replaceAll(`$$"`, "")};\n`,
  );

  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);

  fileWrite(
    file,
    ` Query records in the '${model.name}' table, optionally joining related tables.\n`,
  );

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `export function query${upperCaseFirst(model.name)}<QueryBuilder extends ${contextNames.queryBuilderType.inputType}>(input: QueryBuilder = {}): WrappedQueryResult<${fullTypeName}QueryResolver<QueryBuilder>>`,
  );

  // Input validation
  fileWrite(
    file,
    `const { error, value: validatedInput } = ${contextNames.queryBuilderType.validatorFunction}(input);`,
  );
  fileBlockStart(file, `if (error)`);
  fileWrite(
    file,
    `throw AppError.serverError({
  message: "Query builder input validation failed",
  error,
});`,
  );
  fileBlockEnd(file);

  fileWrite(
    file,
    `return wrapQueryPart(generatedQueryBuilderHelper(${
      model.name
    }QueryBuilderSpec as any, validatedInput, {}), ${
      contextNames.queryResultType.validatorFunction
    }, { hasCustomReturning: validatedInput.select?.length !== ${
      Object.keys(model.keys).length
    }, });`,
  );

  fileBlockEnd(file);
  fileWrite(file, "");
}

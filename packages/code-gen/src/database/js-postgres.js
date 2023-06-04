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
export function jsPostgresGenerateUtils(generateContext) {
  const helperFile = fileContextCreateGeneric(
    generateContext,
    "common/database-helpers.js",
    {
      importCollector: new JavascriptImportCollector(),
    },
  );

  const indexFile = fileContextCreateGeneric(
    generateContext,
    "common/database.js",
    {
      importCollector: new JavascriptImportCollector(),
    },
  );

  const helperImportCollector =
    JavascriptImportCollector.getImportCollector(helperFile);
  const indexImportCollector =
    JavascriptImportCollector.getImportCollector(indexFile);

  helperImportCollector.destructure("@compas/stdlib", "AppError");

  fileWrite(
    helperFile,
    `
/**
 * Wrap a queryPart & validator in something that can either be used directly, or can be chained.
 * 
 * @template {function} T
 *
 * @param {import("@compas/store").QueryPart<any>} queryPart
 * @param {T} validator
 * @param {{ hasCustomReturning: boolean }} options
 * @returns {import("@compas/store").WrappedQueryPart<NonNullable<ReturnType<T>["value"]>>}
 */
export function wrapQueryPart(queryPart, validator, options) {
  return {
    queryPart,
    then: () => {
      throw AppError.serverError({
        message:
          "Awaited a wrapped query part directly. Please use '.exec' or '.execRaw'.",
      });
    },
    exec: async (sql) => {
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
            message: "Database result did not pass the validators.",
            validator: validator.name,
            error,
            databaseValue: queryResult[i],
          });
        }
        
        validatedResult[i] = value;
      }
      
      return validatedResult;
    },
    execRaw: async (sql) => await queryPart.exec(sql),
  };
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
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureObjectDefinition>} model
 * @returns {import("../file/context.js").GenerateFile}
 */
export function jsPostgresCreateFile(generateContext, model) {
  const file = fileContextCreateGeneric(
    generateContext,
    `database/${model.name}.js`,
    {
      importCollector: new JavascriptImportCollector(),
    },
  );

  const importCollector = JavascriptImportCollector.getImportCollector(file);

  importCollector.destructure("../common/database-helpers.js", "wrapQueryPart");
  importCollector.destructure("@compas/store", "query");
  importCollector.destructure("@compas/store", "generatedWhereBuilderHelper");
  importCollector.destructure("@compas/store", "generatedUpdateHelper");
  importCollector.destructure("@compas/stdlib", "isNil");
  importCollector.destructure("@compas/stdlib", "AppError");

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
      `${model.name}UpsertOn${upperCaseFirst(
        modelKeyGetPrimary(model).primaryKeyName,
      )},`,
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
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateWhere(
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
      model.keys[info.modelKey].type === "reference"
        ? structureResolveReference(
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
          fieldType === "number" && !isFloat
            ? "int"
            : fieldType === "number" && isFloat
            ? "float"
            : fieldType === "string"
            ? "varchar"
            : fieldType === "date" && dateOnly
            ? "date"
            : fieldType === "date" && timeOnly
            ? "time"
            : fieldType === "date"
            ? "timestamptz"
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
        where: `$$()=> ${relationInfo.modelInverse.name}WhereSpec$$`,
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
          matcherKey: `via${upperCaseFirst(
            relationInfo.virtualKeyNameInverse,
          )}`,
          matcherType: "via",
          relation: {
            entityName: relationInfo.modelOwn.name,
            shortName: `${relationInfo.modelOwn.shortName}${
              isSelfReferencing ? "2" : ""
            }`,
            entityKey: relationInfo.keyNameOwn,
            referencedKey: relationInfo.primaryKeyNameInverse,
            where: `$$()=> ${relationInfo.modelOwn.name}WhereSpec$$`,
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
            where: `$$()=> ${relationInfo.modelOwn.name}WhereSpec$$`,
          },
        },
      ],
    };
  }

  fileWrite(file, `/** @type {any} */`);
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
  fileWrite(file, "");
  fileWrite(file, ` @param {${contextNames.whereType.inputType}} [where]`);
  fileWrite(
    file,
    ` @param {{ skipValidator?: boolean, shortName?: string }} [options]`,
  );
  fileWrite(file, ` @returns {QueryPart<any>}`);
  fileWrite(file, `/`);

  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `export function ${model.name}Where(where, options = {})`,
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
    `return generatedWhereBuilderHelper(${model.name}WhereSpec, where ?? {}, options.shortName);`,
  );

  fileBlockEnd(file);
  fileWrite(file, "");
}

/**
 * Generate the order by query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateOrderBy(
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
  fileWrite(file, "");
  fileWrite(file, ` @param {${contextNames.orderByType.inputType}} [orderBy]`);
  fileWrite(
    file,
    ` @param {${contextNames.orderBySpecType.inputType}} [orderBySpec]`,
  );
  fileWrite(
    file,
    ` @param {{ skipValidator?: boolean, shortName?: string }} [options]`,
  );
  fileWrite(file, ` @returns {QueryPart<any>}`);
  fileWrite(file, `/`);

  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `export function ${model.name}OrderBy(orderBy, orderBySpec, options = {})`,
  );

  fileWrite(file, `options.shortName ??= "${model.shortName}."`);
  fileWrite(
    file,
    `if (!options.shortName.endsWith(".")) { options.shortName += "."; }`,
  );

  const orderByArray =
    model.queryOptions?.withDates || model.queryOptions?.withSoftDeletes
      ? ["createdAt", "updatedAt", modelKeyGetPrimary(model).primaryKeyName]
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
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateCount(
  generateContext,
  file,
  model,
  contextNames,
) {
  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);

  fileWrite(file, ` Count the records in the '${model.name}' table\n`);

  fileWrite(file, ` @param {import("@compas/store").Postgres} sql`);
  fileWrite(file, ` @param {${contextNames.whereType.inputType}} where`);
  fileWrite(file, ` @returns {Promise<number>}`);

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(file, `async function ${model.name}Count(sql, where)`);

  fileWrite(
    file,
    `const [result] = await query\`select count(${model.shortName}."${
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
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateInsert(
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

  fileWrite(file, ` @param {import("@compas/store").Postgres} sql`);
  fileWrite(
    file,
    ` @param {${contextNames.insertType.inputType}["insert"]} insert`,
  );
  fileWrite(file, ` @param {{ withPrimaryKey?: boolean }} [options={}]`);
  fileWrite(file, ` @returns {Promise<${contextNames.model.outputType}[]>}`);

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `function ${model.name}Insert(sql, insert, options = {})`,
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

  fileWrite(file, ` @param {${contextNames.insertType.inputType}} input`);
  fileWrite(
    file,
    ` @returns {import("@compas/store").WrappedQueryPart<${contextNames.model.outputType}>}`,
  );

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(file, `function ${model.name}InsertInternal(input)`);

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
      field.type === "reference"
        ? structureResolveReference(generateContext.structure, field).type
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
    `str.push(\` RETURNING ${JSON.stringify(Object.keys(model.keys)).slice(
      1,
      -1,
    )}\`);`,
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
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateUpsertOnPrimaryKey(
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

  fileWrite(file, ` @param {import("@compas/store").Postgres} sql`);
  fileWrite(
    file,
    ` @param {${contextNames.insertType.inputType}["insert"]} insert`,
  );
  fileWrite(file, ` @returns {Promise<${contextNames.model.outputType}[]>}`);

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `function ${model.name}UpsertOn${upperCaseFirst(
      modelKeyGetPrimary(model).primaryKeyName,
    )}(sql, insert)`,
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

  fileWrite(file, ` @param {${contextNames.insertType.inputType}} input`);
  fileWrite(
    file,
    ` @returns {import("@compas/store").WrappedQueryPart<${contextNames.model.outputType}>}`,
  );

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `function ${model.name}UpsertOn${upperCaseFirst(
      modelKeyGetPrimary(model).primaryKeyName,
    )}Internal(input)`,
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
    `str.push(\` RETURNING ${JSON.stringify(Object.keys(model.keys)).slice(
      1,
      -1,
    )}\`);`,
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
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateUpdate(
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
      model.keys[key].type === "reference"
        ? structureResolveReference(generateContext.structure, model.keys[key])
            .type
        : model.keys[key].type;

    const subType = ["number", "boolean", "string", "date", "uuid"].includes(
      type,
    )
      ? type
      : "jsonb";

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

  fileWrite(file, `/** @type {any} */`);
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

  fileWrite(file, ` @param {import("@compas/store").Postgres} sql`);
  fileWrite(file, ` @param {${contextNames.updateType.inputType}} update`);
  fileWrite(file, ` @returns {Promise<${contextNames.model.outputType}[]>}`);

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(file, `function ${model.name}Update(sql, update)`);
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

  fileWrite(file, ` @param {${contextNames.updateType.inputType}} input`);
  fileWrite(
    file,
    ` @returns {import("@compas/store").WrappedQueryPart<${contextNames.model.outputType}>}`,
  );

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(file, `function ${model.name}UpdateInternal(input)`);

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
    `return wrapQueryPart(generatedUpdateHelper(${model.name}UpdateSpec, validatedInput), ${contextNames.model.validatorFunction}, { hasCustomReturning: Array.isArray(validatedInput.returning), });`,
  );

  fileBlockEnd(file);
  fileWrite(file, "");
}

/**
 * Generate the delete query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateDelete(
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

  fileWrite(file, ` @param {import("@compas/store").Postgres} sql`);
  fileWrite(file, ` @param {${contextNames.whereType.inputType}} [where]`);
  fileWrite(file, ` @returns {Promise<void>}`);

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(file, `function ${model.name}Delete(sql, where = {})`);
  fileWrite(file, `return ${model.name}DeleteInternal(where).exec(sql);`);
  fileBlockEnd(file);
  fileWrite(file, "");

  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);

  fileWrite(file, ` Remove records from the '${model.name}' table\n`);

  fileWrite(file, ` @param {${contextNames.whereType.inputType}} [where]`);
  fileWrite(file, ` @returns {import("@compas/store").QueryPart<any>}`);

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(file, `function ${model.name}DeleteInternal(where = {})`);

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
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateQueryBuilder(
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
      entityInformation: `$$() => ${relationInfo.modelInverse.name}QueryBuilderSpec$$`,
    });
  }
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
      entityInformation: `$$() => ${relationInfo.modelOwn.name}QueryBuilderSpec$$`,
    });
  }

  fileWrite(file, `/** @type {any} */`);
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

  fileWrite(
    file,
    ` @param {${contextNames.queryBuilderType.inputType}} [input]`,
  );
  fileWrite(
    file,
    ` @returns {import("@compas/store").WrappedQueryPart<${contextNames.queryResultType.outputType}>}`,
  );

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(
    file,
    `export function query${upperCaseFirst(model.name)}(input = {})`,
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
    }QueryBuilderSpec, validatedInput, {}), ${
      contextNames.queryResultType.validatorFunction
    }, { hasCustomReturning: validatedInput.select?.length !== ${
      Object.keys(model.keys).length
    }, });`,
  );

  fileBlockEnd(file);
  fileWrite(file, "");
}

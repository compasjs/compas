import { isNil } from "@compas/stdlib";
import { upperCaseFirst } from "../../utils.js";
import { fileBlockEnd, fileBlockStart } from "../file/block.js";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextRemoveLinePrefix,
  fileContextSetIndent,
} from "../file/context.js";
import { fileFormatInlineComment } from "../file/format.js";
import { fileWrite } from "../file/write.js";
import {
  modelRelationGetInformation,
  modelRelationGetInverse,
  modelRelationGetOwn,
} from "../processors/model-relation.js";
import { modelWhereGetInformation } from "../processors/model-where.js";
import { referenceUtilsGetProperty } from "../processors/reference-utils.js";
import { structureResolveReference } from "../processors/structure.js";
import { JavascriptImportCollector } from "../target/javascript.js";

/**
 * Generate a utils file that can be used by other generators.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function jsPostgresGenerateUtils(generateContext) {
  const file = fileContextCreateGeneric(generateContext, "common/database.js", {
    importCollector: new JavascriptImportCollector(),
  });

  const importCollector = JavascriptImportCollector.getImportCollector(file);
  importCollector.destructure("@compas/stdlib", "AppError");

  fileWrite(
    file,
    `
/**
 * @template Type
 * @typedef {object} WrappedQueryPart
 * @property {import("@compas/store").QueryPart<any>} queryPart
 * @property {function(): void} then
 * @property {(sql: import("@compas/store").Postgres) => Promise<T[]>} exec
 * @property {(sql: import("@compas/store").Postgres) => Promise<(T|any)[]>} execRaw
 */
  
/**
 * Wrap a queryPart & validator in something that can either be used directly, or can be chained.
 * 
 * @template {function} T
 *
 * @param {import("@compas/store").QueryPart<any>} queryPart
 * @param {T} validator
 * @param {{ hasCustomReturning: boolean }} options
 * @returns {WrappedQueryPart<ReturnType<T>["value"]>}
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
}

/**
 * Create a file for the provided model
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @returns {import("../file/context").GenerateFile}
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

  importCollector.destructure("../common/database.js", "wrapQueryPart");
  importCollector.destructure("@compas/store", "query");
  importCollector.destructure("@compas/store", "generatedWhereBuilderHelper");
  importCollector.destructure("@compas/store", "generatedUpdateHelper");
  importCollector.destructure("@compas/stdlib", "isNil");
  importCollector.destructure("@compas/stdlib", "AppError");

  return file;
}

/**
 * Generate the where query function and specification
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator").DatabaseContextNames} contextNames
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
      .replaceAll(`$$"`, "")};`,
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
  fileBlockStart(file, `function ${model.name}Where(where, options = {})`);

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
}

/**
 * Generate the insert query function
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateInsert(
  generateContext,
  file,
  model,
  contextNames,
) {
  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);

  fileWrite(file, ` Insert a record in the '${model.name}' table\n`);

  fileWrite(file, ` @param {${contextNames.insertType.inputType}} input`);
  fileWrite(
    file,
    ` @returns {import("../common/database").WrappedQueryPart<${contextNames.model.outputType}>}`,
  );

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(file, `export function ${model.name}Insert(input)`);

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

  fileWrite(file, `const str = [];`);
  fileWrite(file, `const args = [];`);

  fileBlockStart(file, `for (const insert of validatedInput.insert)`);
  fileBlockStart(file, `if (str.length)`);
  fileWrite(file, `str.push(", (");`);
  fileBlockEnd(file);

  fileBlockStart(file, "else");
  fileWrite(file, `str.push("(");`);
  fileBlockEnd(file);

  for (const [key, field] of Object.entries(model.keys)) {
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
        fileBlockStart(file, `if (isNil(insert.${key}))`);
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
  fileWrite(file, `str[str.length -1] = str.at(-1).slice(0, -2);`);
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

  fileWrite(file, `qb.append(query(str, args));`);
  fileWrite(
    file,
    `return wrapQueryPart(qb, ${contextNames.insertType.validatorFunction}, { hasCustomReturning: Array.isArray(validatedInput.returning), });`,
  );

  fileBlockEnd(file);
}

/**
 * Generate the update query function
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator").DatabaseContextNames} contextNames
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

  fileWrite(
    file,
    `const ${model.name}UpdateSpec = ${JSON.stringify(entityUpdateSpec, null, 2)
      .replaceAll(`"$$`, "")
      .replaceAll(`$$"`, "")};\n`,
  );

  // Doc block
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, ` *`);

  fileWrite(file, ` Update records in the '${model.name}' table\n`);

  fileWrite(file, ` @param {${contextNames.updateType.inputType}} input`);
  fileWrite(
    file,
    ` @returns {import("../common/database").WrappedQueryPart<${contextNames.model.outputType}>}`,
  );

  fileWrite(file, `/`);
  fileContextRemoveLinePrefix(file, 2);

  // Function
  fileBlockStart(file, `function ${model.name}Update(input)`);

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
    `return wrapQueryPart(generatedUpdateHelper(${model.name}UpdateSpec, validatedInput), ${contextNames.updateType.validatorFunction}, { hasCustomReturning: Array.isArray(validatedInput.returning), });`,
  );

  fileBlockEnd(file);
}

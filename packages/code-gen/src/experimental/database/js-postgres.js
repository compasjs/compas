import { fileBlockEnd, fileBlockStart } from "../file/block.js";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextRemoveLinePrefix,
  fileContextSetIndent,
} from "../file/context.js";
import { fileFormatInlineComment } from "../file/format.js";
import { fileWrite } from "../file/write.js";
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
  importCollector.destructure("@compas/stdlib", "isNil");

  return file;
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
  // Dependencies
  const importCollector = JavascriptImportCollector.getImportCollector(file);
  importCollector.destructure("@compas/stdlib", "AppError");

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
  fileWrite(file, `INSERT INTO "${model.name}"`);
  fileContextSetIndent(file, 1);
  fileWrite(file, `(${JSON.stringify(Object.keys(model.keys)).slice(1, -1)})`);
  fileContextSetIndent(file, -1);
  fileWrite(file, `VALUES`);
  fileWrite(file, `\`;`);
  fileContextSetIndent(file, 1);

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

  fileContextSetIndent(file, -1);
  fileBlockEnd(file);
}

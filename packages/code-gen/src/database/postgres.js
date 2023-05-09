import { AppError } from "@compas/stdlib";
import {
  fileContextCreateGeneric,
  fileContextSetIndent,
} from "../file/context.js";
import { fileFormatInlineComment } from "../file/docs.js";
import { fileWrite, fileWriteInline } from "../file/write.js";
import {
  modelKeyGetPrimary,
  modelKeyGetSearchable,
} from "../processors/model-keys.js";
import {
  modelRelationGetInformation,
  modelRelationGetOwn,
} from "../processors/model-relation.js";
import { structureModels } from "../processors/models.js";
import { referenceUtilsGetProperty } from "../processors/reference-utils.js";
import { structureResolveReference } from "../processors/structure.js";
import { typesOptionalityIsOptional } from "../types/optionality.js";
import { stringFormatNameForError, upperCaseFirst } from "../utils.js";

/**
 * Write the DDL out for Postgres
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function databasePostgresWriteDDL(generateContext) {
  const file = fileContextCreateGeneric(
    generateContext,
    "common/structure.sql",
    {
      inlineCommentPrefix: "-- ",
    },
  );

  databasePostgresWriteWarning(file);

  for (const model of structureModels(generateContext)) {
    databasePostgresWriteModelDDL(generateContext, file, model);
  }
}

/**
 * @param {import("../file/context.js").GenerateFile} file
 */
function databasePostgresWriteWarning(file) {
  fileWrite(
    file,
    fileFormatInlineComment(
      file,
      `WARNING:
This file is a suggestion, and can be used to create your migration files.
Please note that many indexes can have a negative impact on performance. Combining indexes may also be a good option in some circumstances.
The order of this output is alphabetically sorted, dependencies between tables are not taken into account.`,
    ),
  );
  fileWrite(file, `\n\n`);
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 */
function databasePostgresWriteModelDDL(generateContext, file, model) {
  if (model.queryOptions?.isView) {
    fileWrite(
      file,
      fileFormatInlineComment(file, `Note: Views are not supported.`),
    );

    fileWrite(
      file,
      fileFormatInlineComment(
        file,
        `CREATE OR REPLACE VIEW "${model.name}" AS SELECT 1 + 1 as "column";`,
      ),
    );
    fileWrite(
      file,
      fileFormatInlineComment(
        file,
        `Required columns: ${JSON.stringify(Object.keys(model.keys)).slice(
          1,
          -1,
        )}`,
      ),
    );
    fileWrite(file, "");

    return;
  }

  fileWrite(file, `CREATE TABLE "${model.name}"`);
  fileWrite(file, `(`);
  fileContextSetIndent(file, 1);

  let hasWrittenALine = false;

  for (const [key, field] of Object.entries(model.keys)) {
    if (hasWrittenALine) {
      fileWrite(file, ",");
    } else {
      hasWrittenALine = true;
    }

    const type =
      field.type === "reference"
        ? structureResolveReference(generateContext.structure, field).type
        : field.type;

    const isPrimary = referenceUtilsGetProperty(generateContext, field, [
      "sql",
      "primary",
    ]);
    const hasDefaultValue = referenceUtilsGetProperty(generateContext, field, [
      "sql",
      "hasDefaultValue",
    ]);
    const isOptional = typesOptionalityIsOptional(generateContext, field, {
      validatorState: "output",
    });

    fileWriteInline(file, `"${key}"`);

    if (isPrimary) {
      switch (
        /** @type {import("../generated/common/types.js").ExperimentalTypeSystemDefinition["type"]} */ type
      ) {
        case "number":
          fileWriteInline(file, ` BIGSERIAL PRIMARY KEY`);

          break;
        case "string":
          fileWriteInline(file, ` varchar PRIMARY KEY`);
          break;
        case "uuid":
          fileWriteInline(file, ` uuid PRIMARY KEY`);
          break;
        default:
          throw AppError.serverError({
            message: "Can't generate primary key for the provided type",
            model: stringFormatNameForError(model),
            key,
            type,
          });
      }
    } else {
      switch (
        /** @type {import("../generated/common/types.js").ExperimentalTypeSystemDefinition["type"]} */ type
      ) {
        case "any":
          fileWriteInline(file, ` jsonb`);
          break;
        case "anyOf":
          fileWriteInline(file, ` jsonb`);
          break;
        case "array":
          fileWriteInline(file, ` jsonb`);
          break;
        case "boolean":
          fileWriteInline(file, ` boolean`);
          break;
        case "date":
          {
            const specifier = referenceUtilsGetProperty(
              generateContext,
              field,
              ["specifier"],
            );
            if (specifier === "dateOnly") {
              fileWriteInline(file, ` date`);
            } else if (specifier === "timeOnly") {
              fileWriteInline(file, ` time`);
            } else {
              fileWriteInline(file, ` timestamptz`);
            }
          }
          break;
        case "generic":
          fileWriteInline(file, ` jsonb`);
          break;
        case "number":
          {
            const isFloat = referenceUtilsGetProperty(generateContext, field, [
              "validator",
              "floatingPoint",
            ]);

            if (isFloat) {
              fileWriteInline(file, ` float`);
            } else {
              fileWriteInline(file, ` int`);
            }
          }
          break;
        case "object":
          fileWriteInline(file, ` jsonb`);
          break;
        case "string":
          fileWriteInline(file, ` varchar`);
          break;
        case "uuid":
          fileWriteInline(file, ` uuid`);
          break;
      }
    }

    if (isOptional && !hasDefaultValue) {
      fileWriteInline(file, ` NULL`);
    } else {
      fileWriteInline(file, ` NOT NULL`);
    }

    if (isPrimary && type === "uuid") {
      fileWriteInline(file, ` DEFAULT uuid_generate_v4()`);
    } else if (
      model.queryOptions?.withDates ||
      model.queryOptions?.withSoftDeletes
    ) {
      if (key === "createdAt" || key === "updatedAt") {
        fileWriteInline(file, ` DEFAULT now()`);
      }
    } else if (hasDefaultValue) {
      fileWriteInline(
        file,
        ` DEFAULT 'Fill in a valid default based on the column type'`,
      );
    }
  }

  for (const relation of modelRelationGetOwn(model)) {
    if (hasWrittenALine) {
      fileWrite(file, ",");
    } else {
      hasWrittenALine = true;
    }

    const relationInfo = modelRelationGetInformation(relation);

    fileWriteInline(
      file,
      `constraint "${model.name}${upperCaseFirst(
        relationInfo.keyNameOwn,
      )}Fk" foreign key ("${relationInfo.keyNameOwn}") references "${
        relationInfo.modelInverse.name
      }" ("${relationInfo.primaryKeyNameInverse}")`,
    );

    if (relation.isOptional) {
      fileWriteInline(file, " ON DELETE SET NULL");
    } else {
      fileWriteInline(file, " ON DELETE CASCADE");
    }
  }

  if (hasWrittenALine) {
    fileWrite(file, "");
  }

  fileContextSetIndent(file, -1);
  fileWrite(file, `);\n`);

  if (model.queryOptions?.withDates || model.queryOptions?.withSoftDeletes) {
    fileWrite(
      file,
      `CREATE INDEX "${model.name}DatesIdx" ON "${model.name}" ("createdAt", "updatedAt");`,
    );
  }

  const { primaryKeyName } = modelKeyGetPrimary(model);
  for (const key of modelKeyGetSearchable(generateContext, model)) {
    if (key === "createdAt" || key === "updatedAt") {
      continue;
    }
    if (primaryKeyName === key) {
      continue;
    }

    fileWrite(
      file,
      `CREATE INDEX "${model.name}${upperCaseFirst(key)}Idx" ON "${
        model.name
      }" ("${key}");`,
    );
  }

  fileWrite(file, "\n");
}

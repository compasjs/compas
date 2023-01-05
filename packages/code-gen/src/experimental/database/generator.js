import { AppError, noop } from "@compas/stdlib";
import { upperCaseFirst } from "../../utils.js";
import { structureModels } from "../processors/models.js";
import { stringFormatNameForError } from "../string-format.js";
import { targetCustomSwitch } from "../target/switcher.js";
import { typesCacheGet } from "../types/cache.js";
import { typesGeneratorUseTypeName } from "../types/generator.js";
import {
  validatorGeneratorGenerateValidator,
  validatorGetNameAndImport,
} from "../validators/generator.js";
import {
  jsPostgresCreateFile,
  jsPostgresGenerateCount,
  jsPostgresGenerateDelete,
  jsPostgresGenerateInsert,
  jsPostgresGenerateOrderBy,
  jsPostgresGenerateQueryBuilder,
  jsPostgresGenerateUpdate,
  jsPostgresGenerateUpsertOnPrimaryKey,
  jsPostgresGenerateUtils,
  jsPostgresGenerateWhere,
} from "./js-postgres.js";

/**
 * @typedef {{
 *   model: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   whereType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   insertType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   updateType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   orderByType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   orderBySpecType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   queryBuilderType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   },
 *   queryResultType: {
 *     inputType: string,
 *     outputType: string,
 *     validatorFunction: string,
 *   }
 * }} DatabaseContextNames
 */

/**
 * Run the database generator.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function databaseGenerator(generateContext) {
  if (!databaseIsEnabled(generateContext)) {
    return;
  }

  const target = databaseFormatTarget(generateContext);

  targetCustomSwitch(
    {
      jsPostgres: jsPostgresGenerateUtils,
      tsPostgres: noop,
    },
    target,
    [generateContext],
  );

  for (const model of structureModels(generateContext)) {
    // Create file
    const file = targetCustomSwitch(
      {
        jsPostgres: jsPostgresCreateFile,
        tsPostgres: noop,
      },
      target,
      [generateContext, model],
    );

    if (!file) {
      throw AppError.serverError({
        message: `Could not create a file for ${stringFormatNameForError(
          model,
        )}. Which is necessary to generate database queries.`,
      });
    }

    const whereType =
      generateContext.structure[model.group][`${model.name}Where`];
    const insertType =
      generateContext.structure[model.group][`${model.name}Insert`];
    const updateType =
      generateContext.structure[model.group][`${model.name}Update`];
    const orderByType =
      generateContext.structure[model.group][`${model.name}OrderBy`];
    const orderBySpecType =
      generateContext.structure[model.group][`${model.name}OrderBySpec`];
    const queryBuilderType =
      generateContext.structure[model.group][`${model.name}QueryBuilder`];
    const queryResultType =
      generateContext.structure[model.group][`${model.name}QueryResult`];

    const allModelTypes = {
      model,
      whereType,
      orderByType,
      orderBySpecType,
      queryBuilderType,
      queryResultType,
    };

    if (!model.queryOptions?.isView) {
      allModelTypes.insertType = insertType;
      allModelTypes.updateType = updateType;
    }

    /** @type {DatabaseContextNames} */
    // @ts-expect-error
    //
    // This starts as a partial type, but will be filled.
    const contextNames = {};

    // Pregenerate all necessary validators, types and store them in a simple context
    // object.
    for (const key of Object.keys(allModelTypes)) {
      validatorGeneratorGenerateValidator(generateContext, allModelTypes[key], {
        validatorState: "output",
        typeOverrides: {},
      });

      const inputType = typesCacheGet(allModelTypes[key], {
        validatorState: "input",
        typeOverrides: {},
        nameSuffix: "Input",
      });
      const outputType = typesCacheGet(allModelTypes[key], {
        validatorState: "output",
        typeOverrides: {},
      });

      if (!outputType || !inputType) {
        throw AppError.serverError({
          message: "Could not resolve type names",
          inputType,
          outputType,
          model,
        });
      }

      // We already convert the types to their usable variant for the target language.
      contextNames[key] = {
        inputType: typesGeneratorUseTypeName(generateContext, file, inputType),
        outputType: typesGeneratorUseTypeName(
          generateContext,
          file,
          outputType,
        ),
        validatorFunction: validatorGetNameAndImport(
          generateContext,
          file,
          allModelTypes[key],
          outputType,
        ),
      };
    }

    targetCustomSwitch(
      {
        jsPostgres: jsPostgresGenerateWhere,
        tsPostgres: noop,
      },
      target,
      [generateContext, file, model, contextNames],
    );

    targetCustomSwitch(
      {
        jsPostgres: jsPostgresGenerateOrderBy,
        tsPostgres: noop,
      },
      target,
      [generateContext, file, model, contextNames],
    );

    targetCustomSwitch(
      {
        jsPostgres: jsPostgresGenerateCount,
        tsPostgres: noop,
      },
      target,
      [generateContext, file, model, contextNames],
    );

    if (!model.queryOptions?.isView) {
      targetCustomSwitch(
        {
          jsPostgres: jsPostgresGenerateInsert,
          tsPostgres: noop,
        },
        target,
        [generateContext, file, model, contextNames],
      );

      targetCustomSwitch(
        {
          jsPostgres: jsPostgresGenerateUpsertOnPrimaryKey,
          tsPostgres: noop,
        },
        target,
        [generateContext, file, model, contextNames],
      );

      targetCustomSwitch(
        {
          jsPostgres: jsPostgresGenerateUpdate,
          tsPostgres: noop,
        },
        target,
        [generateContext, file, model, contextNames],
      );

      targetCustomSwitch(
        {
          jsPostgres: jsPostgresGenerateDelete,
          tsPostgres: noop,
        },
        target,
        [generateContext, file, model, contextNames],
      );
    }

    targetCustomSwitch(
      {
        jsPostgres: jsPostgresGenerateQueryBuilder,
        tsPostgres: noop,
      },
      target,
      [generateContext, file, model, contextNames],
    );
  }
}

/**
 * Format the target to use.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {"jsPostgres"|"tsPostgres"}
 */
export function databaseFormatTarget(generateContext) {
  if (!generateContext.options.generators.database?.target) {
    throw AppError.serverError({
      message:
        "Can't find the database target to use, because the database generator is not enabled by the user.",
    });
  }

  // @ts-expect-error
  //
  // Can't use `as const` or something like that. So flip off.
  return (
    generateContext.options.targetLanguage +
    upperCaseFirst(generateContext.options.generators.database.target.dialect)
  );
}

/**
 * Check if we should run the database generator.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function databaseIsEnabled(generateContext) {
  return generateContext.options.generators.database;
}

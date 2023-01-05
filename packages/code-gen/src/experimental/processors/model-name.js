import { AppError } from "@compas/stdlib";
import { errorsThrowCombinedError } from "../errors.js";
import { stringFormatNameForError } from "../string-format.js";
import { structureModels } from "./models.js";

/**
 * Validate unique model names and short names
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function modelNameValidation(generateContext) {
  /** @type {import("@compas/stdlib").AppError[]} */
  const errors = [];

  const modelNames = {};
  const shortNames = {};

  for (const model of structureModels(generateContext)) {
    if (modelNames[model.name]) {
      errors.push(
        AppError.serverError({
          message: `Model ${stringFormatNameForError(
            model,
          )} reuses the same name as ${stringFormatNameForError(
            modelNames[model.name],
          )}. This will conflict while generating, since all database related output will always end up in a 'databases' folder. Please use unique names for 'T.object("$name").enableQueries()' items.`,
        }),
      );
    }

    modelNames[model.name] = model;

    if (!model.shortName) {
      model.shortName = model.name
        .split(/(?=[A-Z])/)
        .map((it) => (it[0] || "").toLowerCase())
        .join("");
    }

    if (model.shortName.endsWith(".")) {
      model.shortName = model.shortName.slice(0, -1);
    }

    if (shortNames[model.shortName]) {
      errors.push(
        AppError.serverError({
          message: `Model ${stringFormatNameForError(
            model,
          )} has the same '.shortName()' as ${stringFormatNameForError(
            shortNames[model.shortName],
          )} ('${
            model.shortName
          }'). This could conflict if these models share a relation (in)directly. Specify a unique '.shortName()' to either model to resolve this conflict.`,
        }),
      );
    }

    shortNames[model.shortName] = model;

    // @ts-expect-error
    model.queryOptions.schema ??= "";

    if (model.queryOptions?.schema.length) {
      if (!model.queryOptions?.schema.startsWith(`"`)) {
        model.queryOptions.schema = `"${model.queryOptions.schema}"`;
      }

      if (!model.queryOptions?.schema.endsWith(".")) {
        model.queryOptions.schema += ".";
      }
    }
  }

  errorsThrowCombinedError(errors);
}

import { AppError } from "@compas/stdlib";
import { targetLanguageSwitch } from "./switcher.js";

/**
 * Validate if no invalid target combinations are passed and error nicely.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function targetValidateCombinations(generateContext) {
  targetLanguageSwitch(
    generateContext,
    {
      js: targetValidateCombinationsJavascript,
      ts: targetValidateCombinationsTypescript,
    },
    [generateContext],
  );
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 */
export function targetValidateCombinationsJavascript(generateContext) {
  if (generateContext.options.generators.structure) {
    // Allows all available options
  }

  if (generateContext.options.generators.types) {
    // Allows all available options
  }

  if (generateContext.options.generators.validators) {
    // Allows all available options
  }

  if (generateContext.options.generators.openApi) {
    // Allows all available options
  }

  if (generateContext.options.generators.router) {
    // Allows all available options
  }

  if (generateContext.options.generators.database) {
    // Allows all available options
  }

  if (generateContext.options.generators.apiClient) {
    if (generateContext.options.generators.apiClient.target.includeWrapper) {
      throw AppError.serverError({
        message: `Compas code-gen doesn't support generating a Javascript compatible wrapper around the api client. It currently only supports generating an Axios api client. Use 'targetLanguage' set to 'ts' to include a @tanstack/react-query wrapper. Feel free to open a feature request on the repository (https://github.com/compasjs/compas).`,
      });
    }
  }
}

/**
 * @param {import("../generate").GenerateContext} generateContext
 */
export function targetValidateCombinationsTypescript(generateContext) {
  if (generateContext.options.generators.structure) {
    // Allows all available options
  }

  if (generateContext.options.generators.types) {
    // Allows all available options
  }

  if (generateContext.options.generators.validators) {
    // Allows all available options
  }

  if (generateContext.options.generators.openApi) {
    // Allows all available options
  }

  if (generateContext.options.generators.router) {
    throw AppError.serverError({
      message: `Compas code-gen doesn't support generating a Typescript compatible router. It currently only supports generating a Koa compatible router when the 'targetLanguage' is set to 'js'. Feel free to open a feature request on the repository (https://github.com/compasjs/compas).`,
    });
  }

  if (generateContext.options.generators.database) {
    throw AppError.serverError({
      message: `Compas code-gen doesn't support generating a Typescript compatible database client. It currently only supports generating a Postgres compatible database client when the 'targetLanguage' is set to 'js'. Feel free to open a feature request on the repository (https://github.com/compasjs/compas).`,
    });
  }

  if (generateContext.options.generators.apiClient) {
    // Allows all available options
  }
}
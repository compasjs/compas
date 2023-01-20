import { AppError, isNil, noop } from "@compas/stdlib";
import { upperCaseFirst } from "../../utils.js";
import { structureRoutes } from "../processors/routes.js";
import { structureResolveReference } from "../processors/structure.js";
import { targetCustomSwitch } from "../target/switcher.js";
import { typesCacheGet } from "../types/cache.js";
import {
  typesGeneratorGenerateNamedType,
  typesGeneratorUseTypeName,
} from "../types/generator.js";
import {
  validatorGeneratorGenerateValidator,
  validatorGetNameAndImport,
} from "../validators/generator.js";
import {
  jsAxiosGenerateFunction,
  jsAxiosGenerateCommonFile,
  jsAxiosGetApiClientFile,
} from "./js-axios.js";

/**
 * Run the API client generator.
 *
 * TODO: extend docs
 *
 * TODO: support ts-axios
 *
 * TODO: throw when js-axios is used with react-query wrapper
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function apiClientGenerator(generateContext) {
  if (!apiClientIsEnabled(generateContext)) {
    return;
  }

  const target = apiClientFormatTarget(generateContext);

  targetCustomSwitch(
    {
      jsAxios: jsAxiosGenerateCommonFile,
      tsAxios: noop,
    },
    target,
    [generateContext],
  );

  for (const route of structureRoutes(generateContext)) {
    const file = targetCustomSwitch(
      {
        jsAxios: jsAxiosGetApiClientFile,
        tsAxios: noop,
      },
      target,
      [generateContext, route],
    );

    if (!file) {
      throw AppError.serverError({
        message: "Could not resolve apiClient file for route",
        options: generateContext.options,
        route,
      });
    }

    const types = {
      params: route.params,
      query: route.query,
      files: route.files,
      body: route.body,
      response: route.response,
    };

    const contextNames = {};

    for (const [name, type] of Object.entries(types)) {
      if (isNil(type)) {
        continue;
      }
      const typeRef = structureResolveReference(
        generateContext.structure,
        type,
      );

      if (name === "response") {
        // @ts-expect-error
        validatorGeneratorGenerateValidator(generateContext, typeRef, {
          validatorState: "output",
          nameSuffix: "",
          typeOverrides: {},
        });
      } else {
        // @ts-expect-error
        typesGeneratorGenerateNamedType(generateContext, typeRef, {
          validatorState: "input",
          nameSuffix: "",
          typeOverrides: {},
        });
      }

      // @ts-expect-error
      contextNames[`${name}Type`] = typesCacheGet(typeRef, {
        validatorState: name === "response" ? "output" : "input",
        nameSuffix: "",
        typeOverrides: {},
      });

      contextNames[`${name}TypeName`] = typesGeneratorUseTypeName(
        generateContext,
        file,
        contextNames[`${name}Type`],
      );

      if (name === "response") {
        contextNames[`${name}Validator`] = validatorGetNameAndImport(
          generateContext,
          file,

          // @ts-expect-error
          typeRef,
          contextNames[`${name}Type`],
        );
      }
    }

    targetCustomSwitch(
      {
        jsAxios: jsAxiosGenerateFunction,
        tsAxios: noop,
      },
      target,
      [
        generateContext,
        file,
        generateContext.options.generators.apiClient,
        route,

        // @ts-expect-error
        contextNames,
      ],
    );
  }
}

/**
 * Format the target to use.
 *
 * TODO: Apply this return type on other target format functions in other generators
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {`${import("../generate").GenerateContext["options"]["targetLanguage"]
 * }${Capitalize<NonNullable<
 * import("../generate").GenerateContext["options"]["generators"]["apiClient"]>["target"]["library"]
 * >}`}
 */
export function apiClientFormatTarget(generateContext) {
  if (!generateContext.options.generators.apiClient?.target) {
    throw AppError.serverError({
      message:
        "Can't find the api client target to use, because the api client generator is not enabled by the user.",
    });
  }

  // @ts-expect-error
  //
  // Can't use `as const` or something like that. So flip off.
  return (
    generateContext.options.targetLanguage +
    upperCaseFirst(generateContext.options.generators.apiClient.target.library)
  );
}

/**
 * Check if we should run the router generator.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function apiClientIsEnabled(generateContext) {
  return generateContext.options.generators.apiClient;
}

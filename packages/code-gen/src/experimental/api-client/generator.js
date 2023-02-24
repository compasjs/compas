import { AppError, isNil } from "@compas/stdlib";
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
  axiosReactQueryGenerateFunction,
  axiosReactQueryGetApiClientFile,
} from "./axios-react-query.js";
import {
  jsAxiosGenerateCommonFile,
  jsAxiosGenerateFunction,
  jsAxiosGetApiClientFile,
} from "./js-axios.js";
import {
  tsAxiosGenerateCommonFile,
  tsAxiosGenerateFunction,
  tsAxiosGetApiClientFile,
} from "./ts-axios.js";

/**
 * Run the API client generator.
 *
 * TODO: extend docs
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
  const wrapperTarget = apiClientFormatWrapperTarget(generateContext);

  /** @type {import("../generated/common/types").ExperimentalAnyDefinitionTarget[]} */
  const typeTargets = [generateContext.options.targetLanguage, target];
  if (
    generateContext.options.generators.apiClient?.target.targetRuntime ===
    "browser"
  ) {
    typeTargets.push("tsAxiosBrowser");
  } else if (
    generateContext.options.generators.apiClient?.target.targetRuntime ===
    "react-native"
  ) {
    typeTargets.push("tsAxiosReactNative");
  }
  const skipResponseValidation =
    typeTargets.includes("tsAxiosBrowser") ||
    typeTargets.includes("tsAxiosReactNative");

  targetCustomSwitch(
    {
      jsAxios: jsAxiosGenerateCommonFile,
      tsAxios: tsAxiosGenerateCommonFile,
    },
    target,
    [generateContext],
  );

  for (const route of structureRoutes(generateContext)) {
    const file = targetCustomSwitch(
      {
        jsAxios: jsAxiosGetApiClientFile,
        tsAxios: tsAxiosGetApiClientFile,
      },
      target,
      [generateContext, route],
    );

    const wrapperFile = targetCustomSwitch(
      {
        axiosReactQuery: axiosReactQueryGetApiClientFile,
      },
      wrapperTarget,
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

      if (name === "response" && !skipResponseValidation) {
        // @ts-expect-error
        validatorGeneratorGenerateValidator(generateContext, typeRef, {
          validatorState: "output",
          nameSuffixes: {
            input: "Input",
            output: "Validated",
          },
          targets: typeTargets,
        });
      } else {
        // @ts-expect-error
        typesGeneratorGenerateNamedType(generateContext, typeRef, {
          validatorState: name === "response" ? "output" : "input",
          nameSuffixes: {
            input: "Input",
            output: "Validated",
          },
          targets: typeTargets,
        });
      }

      // @ts-expect-error
      contextNames[`${name}Type`] = typesCacheGet(generateContext, typeRef, {
        validatorState: name === "response" ? "output" : "input",
        targets: typeTargets,
      });

      contextNames[`${name}TypeName`] = typesGeneratorUseTypeName(
        generateContext,
        file,
        contextNames[`${name}Type`],
      );
      if (wrapperFile) {
        typesGeneratorUseTypeName(
          generateContext,
          wrapperFile,
          contextNames[`${name}Type`],
        );
      }

      if (name === "response" && !skipResponseValidation) {
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
        tsAxios: tsAxiosGenerateFunction,
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
    if (wrapperFile) {
      targetCustomSwitch(
        {
          axiosReactQuery: axiosReactQueryGenerateFunction,
        },
        wrapperTarget,
        [
          generateContext,
          wrapperFile,
          generateContext.options.generators.apiClient,
          route,

          // @ts-expect-error
          contextNames,
        ],
      );
    }
  }
}

/**
 * Format the target to use.
 *
 * TODO: Apply this return type on other target format functions in other generators
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {"jsAxios"|"tsAxios"}
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
 * Format the api client wrapper target.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {"axiosReactQuery"|undefined}
 */
export function apiClientFormatWrapperTarget(generateContext) {
  if (
    generateContext.options.generators.apiClient?.target.library === "axios" &&
    generateContext.options.generators.apiClient.target.includeWrapper ===
      "react-query"
  ) {
    return "axiosReactQuery";
  }

  return undefined;
}

/**
 * Check if we should run the router generator.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function apiClientIsEnabled(generateContext) {
  return generateContext.options.generators.apiClient;
}

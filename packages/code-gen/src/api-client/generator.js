import { AppError, isNil } from "@compas/stdlib";
import { structureRoutes } from "../processors/routes.js";
import { structureResolveReference } from "../processors/structure.js";
import { targetCustomSwitch } from "../target/switcher.js";
import { typesCacheGet } from "../types/cache.js";
import {
  typesGeneratorGenerateNamedType,
  typesGeneratorUseTypeName,
} from "../types/generator.js";
import { upperCaseFirst } from "../utils.js";
import {
  validatorGeneratorGenerateValidator,
  validatorGetNameAndImport,
} from "../validators/generator.js";
import {
  jsAxiosGenerateCommonFile,
  jsAxiosGenerateFunction,
  jsAxiosGetApiClientFile,
} from "./js-axios.js";
import {
  jsFetchGenerateCommonFile,
  jsFetchGenerateFunction,
  jsFetchGetApiClientFile,
} from "./js-fetch.js";
import {
  reactQueryGenerateCommonFile,
  reactQueryGenerateFunction,
  reactQueryGetApiClientFile,
} from "./react-query.js";
import {
  tsAxiosGenerateCommonFile,
  tsAxiosGenerateFunction,
  tsAxiosGetApiClientFile,
} from "./ts-axios.js";
import {
  tsFetchGenerateCommonFile,
  tsFetchGenerateFunction,
  tsFetchGetApiClientFile,
} from "./ts-fetch.js";

/**
 * Run the API client generator.
 *
 * TODO: extend docs
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function apiClientGenerator(generateContext) {
  if (!apiClientIsEnabled(generateContext)) {
    return;
  }

  const distilledTargetInfo = apiClientDistilledTargetInfo(generateContext);
  const target = apiClientFormatTarget(generateContext);
  const wrapperTarget = apiClientFormatWrapperTarget(generateContext);

  /** @type {import("../generated/common/types.js").ExperimentalAnyDefinitionTarget[]} */
  const typeTargets = [generateContext.options.targetLanguage, target];

  if (distilledTargetInfo.isAxios) {
    if (distilledTargetInfo.isBrowser) {
      typeTargets.push("tsAxiosBrowser");
    } else if (distilledTargetInfo.isReactNative) {
      typeTargets.push("tsAxiosReactNative");
    }
  } else if (distilledTargetInfo.isFetch) {
    if (distilledTargetInfo.isBrowser) {
      typeTargets.push("tsFetchBrowser");
    } else if (distilledTargetInfo.isReactNative) {
      typeTargets.push("tsFetchReactNative");
    }
  }

  targetCustomSwitch(
    {
      jsAxios: jsAxiosGenerateCommonFile,
      tsAxios: tsAxiosGenerateCommonFile,
      jsFetch: jsFetchGenerateCommonFile,
      tsFetch: tsFetchGenerateCommonFile,
    },
    target,
    [generateContext],
  );

  targetCustomSwitch(
    {
      reactQuery: reactQueryGenerateCommonFile,
    },
    wrapperTarget,
    [generateContext],
  );

  for (const route of structureRoutes(generateContext)) {
    const file = targetCustomSwitch(
      {
        jsAxios: jsAxiosGetApiClientFile,
        tsAxios: tsAxiosGetApiClientFile,
        jsFetch: jsFetchGetApiClientFile,
        tsFetch: tsFetchGetApiClientFile,
      },
      target,
      [generateContext, route],
    );

    const wrapperFile = targetCustomSwitch(
      {
        reactQuery: reactQueryGetApiClientFile,
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

      if (name === "response" && !distilledTargetInfo.skipResponseValidation) {
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

      if (name === "response" && !distilledTargetInfo.skipResponseValidation) {
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
        jsFetch: jsFetchGenerateFunction,
        tsFetch: tsFetchGenerateFunction,
      },
      target,
      [
        generateContext,
        file,
        route,

        // @ts-expect-error
        contextNames,
      ],
    );

    if (wrapperFile) {
      targetCustomSwitch(
        {
          reactQuery: reactQueryGenerateFunction,
        },
        wrapperTarget,
        [
          generateContext,
          wrapperFile,
          route,

          // @ts-expect-error
          contextNames,
        ],
      );
    }
  }
}

/**
 * Distill the targets in to a short list of booleans.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {{
 *  isAxios: boolean,
 *  isFetch: boolean,
 *  isNode: boolean,
 *  isBrowser: boolean,
 *  isReactNative: boolean,
 *  useGlobalClients: boolean,
 *  skipResponseValidation: boolean,
 * }}
 */
export function apiClientDistilledTargetInfo(generateContext) {
  const apiClientOpts = generateContext.options.generators.apiClient;

  return {
    isAxios: apiClientOpts?.target.library === "axios",
    isFetch: apiClientOpts?.target.library === "fetch",
    isNode: apiClientOpts?.target.targetRuntime === "node.js",
    isBrowser: apiClientOpts?.target.targetRuntime === "browser",
    isReactNative: apiClientOpts?.target.targetRuntime === "react-native",
    useGlobalClients: apiClientOpts?.target.globalClient ?? false,
    skipResponseValidation:
      apiClientOpts?.target.targetRuntime === "browser" ||
      apiClientOpts?.target.targetRuntime === "react-native",
  };
}

/**
 * Format the target to use.
 *
 * TODO: Apply this return type on other target format functions in other generators
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {"jsAxios"|"tsAxios"|"jsFetch"|"tsFetch"}
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
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {"reactQuery"|undefined}
 */
export function apiClientFormatWrapperTarget(generateContext) {
  if (
    generateContext.options.generators.apiClient?.target.includeWrapper ===
    "react-query"
  ) {
    return "reactQuery";
  }

  return undefined;
}

/**
 * Check if we should run the router generator.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function apiClientIsEnabled(generateContext) {
  return generateContext.options.generators.apiClient;
}

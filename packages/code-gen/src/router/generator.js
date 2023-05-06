import { AppError, noop } from "@compas/stdlib";
import { routeTrieGet } from "../processors/route-trie.js";
import { structureRoutes } from "../processors/routes.js";
import { structureResolveReference } from "../processors/structure.js";
import {
  targetCustomSwitch,
  targetLanguageSwitch,
} from "../target/switcher.js";
import { typesCacheGet } from "../types/cache.js";
import { typesGeneratorUseTypeName } from "../types/generator.js";
import { upperCaseFirst } from "../utils.js";
import {
  validatorGeneratorGenerateValidator,
  validatorGetNameAndImport,
} from "../validators/generator.js";
import { javascriptRouteMatcher } from "./javascript.js";
import {
  jsKoaBuildRouterFile,
  jsKoaGetControllerFile,
  jsKoaGetRouterFile,
  jsKoaPrepareContext,
  jsKoaRegisterCompasStructureRoute,
  jsKoaWriteHandlers,
  jsKoaWriteTags,
} from "./js-koa.js";

/**
 * Run the router generator.
 *
 * TODO: Expand docs
 *
 * - route matcher
 * - target specific controller
 * - types & validations
 *
 * TODO: throw when TS is used with the router
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function routerGenerator(generateContext) {
  if (!routerIsEnabled(generateContext)) {
    return;
  }

  targetLanguageSwitch(
    generateContext,
    {
      js: javascriptRouteMatcher,
      ts: noop,
    },
    [generateContext, routeTrieGet(generateContext)],
  );

  const target = routerFormatTarget(generateContext);
  /** @type {import("../generated/common/types.js").ExperimentalAnyDefinitionTarget[]} */
  const typeTargets = ["js", "jsKoaReceive"];

  /** @type Record<string, (import("../types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>)[]>} */
  const routesPerGroup = {};

  for (const route of structureRoutes(generateContext)) {
    if (!routesPerGroup[route.group]) {
      routesPerGroup[route.group] = [];
    }

    routesPerGroup[route.group].push(route);
  }

  const routerFile = targetCustomSwitch(
    {
      jsKoa: jsKoaGetRouterFile,
      tsKoa: noop,
    },
    target,
    [generateContext],
  );

  if (!routerFile) {
    throw AppError.serverError({
      message: "Could not create router file",
      opts: generateContext.options,
    });
  }

  const nameMap = new Map();

  for (const [group, routes] of Object.entries(routesPerGroup)) {
    const file = targetCustomSwitch(
      {
        jsKoa: jsKoaGetControllerFile,
        tsKoa: noop,
      },
      target,
      [generateContext, group],
    );

    if (!file) {
      throw AppError.serverError({
        message: "Could not create controller file",
        opts: generateContext.options,
        group,
      });
    }

    for (const route of routes) {
      const types = {
        params: route.params,
        query: route.query,
        files: route.files,
        body: route.body,
        response: route.response,
      };

      const result = {};
      for (const [prefix, type] of Object.entries(types)) {
        if (!type) {
          continue;
        }

        const specificTargets =
          prefix === "response"
            ? typeTargets
                .filter((it) => it !== "jsKoaReceive")
                .concat(["jsKoaSend"])
            : typeTargets;

        const resolvedRef = structureResolveReference(
          generateContext.structure,
          type,
        );

        // @ts-expect-error
        validatorGeneratorGenerateValidator(generateContext, resolvedRef, {
          validatorState: "output",
          nameSuffixes:
            prefix !== "response"
              ? {
                  input: "ValidatorInput",
                  output: "Validated",
                }
              : {
                  input: "RouterOutput",
                  output: "RouterValidated",
                },
          targets: specificTargets,
          preferInputBaseName: prefix === "response",
        });

        result[`${prefix}TypeName`] = typesCacheGet(
          generateContext,

          // @ts-expect-error
          resolvedRef,
          {
            validatorState: "output",
            nameSuffixes:
              prefix !== "response"
                ? {
                    input: "ValidatorInput",
                    output: "Validated",
                  }
                : {
                    input: "RouterOutput",
                    output: "RouterValidated",
                  },
            targets: specificTargets,
          },
        );

        result[`${prefix}Type`] = typesGeneratorUseTypeName(
          generateContext,

          file,
          result[`${prefix}TypeName`],
        );

        result[`${prefix}Validator`] = validatorGetNameAndImport(
          generateContext,
          routerFile,

          // @ts-expect-error
          resolvedRef,
          result[`${prefix}TypeName`],
        );
      }

      nameMap.set(route, result);

      targetCustomSwitch(
        {
          jsKoa: jsKoaPrepareContext,
          tsKoa: noop,
        },
        target,
        [
          generateContext,
          file,
          route,

          // @ts-expect-error
          result,
        ],
      );
    }

    targetCustomSwitch(
      {
        jsKoa: jsKoaWriteHandlers,
        tsKoa: noop,
      },
      target,
      [file, group, routes, nameMap],
    );

    targetCustomSwitch(
      {
        jsKoa: jsKoaWriteTags,
        tsKoa: noop,
      },
      target,
      [file, group, routes],
    );
  }

  targetCustomSwitch(
    {
      jsKoa: jsKoaBuildRouterFile,
      tsKoa: noop,
    },
    target,
    [routerFile, routesPerGroup, nameMap],
  );

  targetCustomSwitch(
    {
      jsKoa: jsKoaRegisterCompasStructureRoute,
      tsKoa: noop,
    },
    target,
    [generateContext, routerFile],
  );
}

/**
 * Format the target to use.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {"jsKoa"|"tsKoa"}
 */
export function routerFormatTarget(generateContext) {
  if (!generateContext.options.generators.router?.target) {
    throw AppError.serverError({
      message:
        "Can't find the router target to use, because the router generator is not enabled by the user.",
    });
  }

  // @ts-expect-error
  //
  // Can't use `as const` or something like that. So flip off.
  return (
    generateContext.options.targetLanguage +
    upperCaseFirst(generateContext.options.generators.router.target.library)
  );
}

/**
 * Check if we should run the router generator.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function routerIsEnabled(generateContext) {
  return generateContext.options.generators.router;
}

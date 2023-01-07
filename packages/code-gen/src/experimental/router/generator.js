import { AppError, noop } from "@compas/stdlib";
import { upperCaseFirst } from "../../utils.js";
import { routeTrieGet } from "../processors/route-trie.js";
import { targetLanguageSwitch } from "../target/switcher.js";
import { javascriptRouteMatcher } from "./javascript.js";

/**
 * Run the router generator.
 *
 * @param {import("../generate").GenerateContext} generateContext
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

  // TODO: Build general controller (router({ bodyParser, fileParser }) -> Koa middleware)
  // TODO: Build group specific controllers.
  // TODO: implement compas.structure route
}

/**
 * Format the target to use.
 *
 * @param {import("../generate").GenerateContext} generateContext
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
 * @param {import("../generate").GenerateContext} generateContext
 */
export function routerIsEnabled(generateContext) {
  return generateContext.options.generators.router;
}

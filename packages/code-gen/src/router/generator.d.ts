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
export function routerGenerator(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Format the target to use.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {"jsKoa"|"tsKoa"}
 */
export function routerFormatTarget(
  generateContext: import("../generate.js").GenerateContext,
): "jsKoa" | "tsKoa";
/**
 * Check if we should run the router generator.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function routerIsEnabled(
  generateContext: import("../generate.js").GenerateContext,
):
  | {
      target: {
        library: "koa";
      };
      exposeApiStructure: boolean;
    }
  | undefined;
//# sourceMappingURL=generator.d.ts.map

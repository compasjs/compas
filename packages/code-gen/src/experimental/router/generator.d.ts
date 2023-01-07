/**
 * Run the router generator.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function routerGenerator(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Format the target to use.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {"jsKoa"|"tsKoa"}
 */
export function routerFormatTarget(
  generateContext: import("../generate").GenerateContext,
): "jsKoa" | "tsKoa";
/**
 * Check if we should run the router generator.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function routerIsEnabled(
  generateContext: import("../generate").GenerateContext,
):
  | {
      target: {
        library: "koa";
      };
      exposeApiStructure: boolean;
    }
  | undefined;
//# sourceMappingURL=generator.d.ts.map

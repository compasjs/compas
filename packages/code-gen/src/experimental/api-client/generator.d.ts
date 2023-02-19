/**
 * Run the API client generator.
 *
 * TODO: extend docs
 *
 * TODO: throw when js-axios is used with react-query wrapper
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function apiClientGenerator(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Format the target to use.
 *
 * TODO: Apply this return type on other target format functions in other generators
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {"jsAxios"|"tsAxios"}
 */
export function apiClientFormatTarget(
  generateContext: import("../generate").GenerateContext,
): "jsAxios" | "tsAxios";
/**
 * Format the api client wrapper target.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {"axiosReactQuery"|undefined}
 */
export function apiClientFormatWrapperTarget(
  generateContext: import("../generate").GenerateContext,
): "axiosReactQuery" | undefined;
/**
 * Check if we should run the router generator.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function apiClientIsEnabled(
  generateContext: import("../generate").GenerateContext,
):
  | {
      target: {
        library: "axios";
        targetRuntime: "browser" | "react-native" | "node.js";
        includeWrapper?: "react-query" | undefined;
        globalClient: boolean;
      };
      responseValidation: {
        looseObjectValidation: boolean;
      };
    }
  | undefined;
//# sourceMappingURL=generator.d.ts.map

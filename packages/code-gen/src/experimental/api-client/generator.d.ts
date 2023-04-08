/**
 * Run the API client generator.
 *
 * TODO: extend docs
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function apiClientGenerator(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Distill the targets in to a short list of booleans.
 *
 * @param {import("../generate").GenerateContext} generateContext
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
export function apiClientDistilledTargetInfo(
  generateContext: import("../generate").GenerateContext,
): {
  isAxios: boolean;
  isFetch: boolean;
  isNode: boolean;
  isBrowser: boolean;
  isReactNative: boolean;
  useGlobalClients: boolean;
  skipResponseValidation: boolean;
};
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
 * @returns {"reactQuery"|undefined}
 */
export function apiClientFormatWrapperTarget(
  generateContext: import("../generate").GenerateContext,
): "reactQuery" | undefined;
/**
 * Check if we should run the router generator.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function apiClientIsEnabled(
  generateContext: import("../generate").GenerateContext,
):
  | {
      target:
        | {
            library: "axios";
            targetRuntime: "browser" | "react-native" | "node.js";
            includeWrapper?: "react-query" | undefined;
            globalClient: boolean;
          }
        | {
            library: "fetch";
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

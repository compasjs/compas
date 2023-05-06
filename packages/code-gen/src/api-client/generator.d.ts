/**
 * Run the API client generator.
 *
 * TODO: extend docs
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function apiClientGenerator(
  generateContext: import("../generate.js").GenerateContext,
): void;
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
export function apiClientDistilledTargetInfo(
  generateContext: import("../generate.js").GenerateContext,
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
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {"jsAxios"|"tsAxios"|"jsFetch"|"tsFetch"}
 */
export function apiClientFormatTarget(
  generateContext: import("../generate.js").GenerateContext,
): "jsAxios" | "tsAxios" | "jsFetch" | "tsFetch";
/**
 * Format the api client wrapper target.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {"reactQuery"|undefined}
 */
export function apiClientFormatWrapperTarget(
  generateContext: import("../generate.js").GenerateContext,
): "reactQuery" | undefined;
/**
 * Check if we should run the router generator.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function apiClientIsEnabled(
  generateContext: import("../generate.js").GenerateContext,
):
  | {
      target:
        | {
            library: "axios";
            targetRuntime: "node.js" | "browser" | "react-native";
            includeWrapper?: "react-query" | undefined;
            globalClient: boolean;
          }
        | {
            library: "fetch";
            targetRuntime: "node.js" | "browser" | "react-native";
            includeWrapper?: "react-query" | undefined;
            globalClient: boolean;
          };
      responseValidation: {
        looseObjectValidation: boolean;
      };
    }
  | undefined;
//# sourceMappingURL=generator.d.ts.map

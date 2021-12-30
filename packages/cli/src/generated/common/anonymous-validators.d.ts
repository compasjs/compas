/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<string>}
 */
export function anonymousValidator186795873(
  value: any,
  propertyPath: string,
): EitherN<string>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<string>}
 */
export function anonymousValidator1987407853(
  value: any,
  propertyPath: string,
): EitherN<string>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<undefined|string>}
 */
export function anonymousValidator1443576836(
  value: any,
  propertyPath: string,
): EitherN<undefined | string>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<boolean>}
 */
export function anonymousValidator1174857441(
  value: any,
  propertyPath: string,
): EitherN<boolean>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"isDynamic": boolean, "isCosmetic": boolean, }>}
 */
export function anonymousValidator423569622(
  value: any,
  propertyPath: string,
): EitherN<{
  isDynamic: boolean;
  isCosmetic: boolean;
}>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<undefined|((value: string) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>)>}
 */
export function anonymousValidator193358577(
  value: any,
  propertyPath: string,
): EitherN<
  | ((value: string) =>
      | {
          isValid: boolean;
          error?: {
            message: string;
          };
        }
      | Promise<{
          isValid: boolean;
          error?: {
            message: string;
          };
        }>)
  | undefined
>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<(import("./types").CliCommandDefinition)[]>}
 */
export function anonymousValidator1489856765(
  value: any,
  propertyPath: string,
): EitherN<import("./types").CliCommandDefinition[]>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<string>}
 */
export function anonymousValidator918642030(
  value: any,
  propertyPath: string,
): EitherN<string>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<undefined|string>}
 */
export function anonymousValidator287762602(
  value: any,
  propertyPath: string,
): EitherN<undefined | string>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"isRepeatable": boolean, "isRequired": boolean, }>}
 */
export function anonymousValidator334628214(
  value: any,
  propertyPath: string,
): EitherN<{
  isRepeatable: boolean;
  isRequired: boolean;
}>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<"boolean"|"number"|"string"|"booleanOrString">}
 */
export function anonymousValidator1672956483(
  value: any,
  propertyPath: string,
): EitherN<"boolean" | "number" | "string" | "booleanOrString">;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<undefined|((value: any) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>)>}
 */
export function anonymousValidator126524240(
  value: any,
  propertyPath: string,
): EitherN<
  | ((value: any) =>
      | {
          isValid: boolean;
          error?: {
            message: string;
          };
        }
      | Promise<{
          isValid: boolean;
          error?: {
            message: string;
          };
        }>)
  | undefined
>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"specification": "boolean"|"number"|"string"|"booleanOrString", "validator"?: undefined|((value: any) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>), }>}
 */
export function anonymousValidator621901455(
  value: any,
  propertyPath: string,
): EitherN<{
  specification: "boolean" | "number" | "string" | "booleanOrString";
  validator?:
    | ((value: any) =>
        | {
            isValid: boolean;
            error?: {
              message: string;
            };
          }
        | Promise<{
            isValid: boolean;
            error?: {
              message: string;
            };
          }>)
    | undefined;
}>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"name": string, "rawName": string, "description"?: undefined|string, "modifiers": {"isRepeatable": boolean, "isRequired": boolean, }, "value": {"specification": "boolean"|"number"|"string"|"booleanOrString", "validator"?: undefined|((value: any) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>), }, }>}
 */
export function anonymousValidator1885876481(
  value: any,
  propertyPath: string,
): EitherN<{
  name: string;
  rawName: string;
  description?: undefined | string;
  modifiers: {
    isRepeatable: boolean;
    isRequired: boolean;
  };
  value: {
    specification: "boolean" | "number" | "string" | "booleanOrString";
    validator?:
      | ((value: any) =>
          | {
              isValid: boolean;
              error?: {
                message: string;
              };
            }
          | Promise<{
              isValid: boolean;
              error?: {
                message: string;
              };
            }>)
      | undefined;
  };
}>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<(import("./types").CliFlagDefinition)[]>}
 */
export function anonymousValidator1259325376(
  value: any,
  propertyPath: string,
): EitherN<import("./types").CliFlagDefinition[]>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<undefined|((logger: import("@compas/stdlib").Logger, state: import("../../cli/types").CliExecutorState) => (Promise<import("../../cli/types").CliResult>|CliResult))>}
 */
export function anonymousValidator779701095(
  value: any,
  propertyPath: string,
): EitherN<
  | ((
      logger: import("@compas/stdlib").Logger,
      state: import("../../cli/types").CliExecutorState,
    ) => Promise<import("../../cli/types").CliResult> | CliResult)
  | undefined
>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"name": string, "shortDescription": string, "longDescription"?: undefined|string, "modifiers": {"isDynamic": boolean, "isCosmetic": boolean, }, "dynamicValidator"?: undefined|((value: string) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>), "subCommands": (import("./types").CliCommandDefinition)[], "flags": (import("./types").CliFlagDefinition)[], "executor"?: undefined|((logger: import("@compas/stdlib").Logger, state: import("../../cli/types").CliExecutorState) => (Promise<import("../../cli/types").CliResult>|CliResult)), }>}
 */
export function anonymousValidator1833756126(
  value: any,
  propertyPath: string,
): EitherN<{
  name: string;
  shortDescription: string;
  longDescription?: undefined | string;
  modifiers: {
    isDynamic: boolean;
    isCosmetic: boolean;
  };
  dynamicValidator?:
    | ((value: string) =>
        | {
            isValid: boolean;
            error?: {
              message: string;
            };
          }
        | Promise<{
            isValid: boolean;
            error?: {
              message: string;
            };
          }>)
    | undefined;
  subCommands: import("./types").CliCommandDefinition[];
  flags: import("./types").CliFlagDefinition[];
  executor?:
    | ((
        logger: import("@compas/stdlib").Logger,
        state: import("../../cli/types").CliExecutorState,
      ) => Promise<import("../../cli/types").CliResult> | CliResult)
    | undefined;
}>;
export type InternalError = {
  propertyPath: string;
  key: string;
  info: any;
};
export type EitherN<T> = import("@compas/stdlib").EitherN<T, InternalError>;
//# sourceMappingURL=anonymous-validators.d.ts.map

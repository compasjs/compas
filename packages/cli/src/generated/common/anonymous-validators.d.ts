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
 * @returns {EitherN<undefined|(() => Promise<{ completions: { name: string, description?: string }[] }>|{ completions: { name: string, description?: string }[] })>}
 */
export function anonymousValidator2089925369(
  value: any,
  propertyPath: string,
): EitherN<
  | undefined
  | (() =>
      | Promise<{
          completions: {
            name: string;
            description?: string;
          }[];
        }>
      | {
          completions: {
            name: string;
            description?: string;
          }[];
        })
>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"validator"?: undefined|((value: string) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>), "completions"?: undefined|(() => Promise<{ completions: { name: string, description?: string }[] }>|{ completions: { name: string, description?: string }[] }), }>}
 */
export function anonymousValidator956118885(
  value: any,
  propertyPath: string,
): EitherN<{
  validator?:
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
  completions?:
    | undefined
    | (() =>
        | Promise<{
            completions: {
              name: string;
              description?: string;
            }[];
          }>
        | {
            completions: {
              name: string;
              description?: string;
            }[];
          });
}>;
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
 * @returns {EitherN<{"isRepeatable": boolean, "isRequired": boolean, "isInternal": boolean, }>}
 */
export function anonymousValidator121992102(
  value: any,
  propertyPath: string,
): EitherN<{
  isRepeatable: boolean;
  isRequired: boolean;
  isInternal: boolean;
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
 * @returns {EitherN<{"specification": "boolean"|"number"|"string"|"booleanOrString", "validator"?: undefined|((value: any) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>), "completions"?: undefined|(() => Promise<{ completions: { name: string, description?: string }[] }>|{ completions: { name: string, description?: string }[] }), }>}
 */
export function anonymousValidator2072557027(
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
  completions?:
    | undefined
    | (() =>
        | Promise<{
            completions: {
              name: string;
              description?: string;
            }[];
          }>
        | {
            completions: {
              name: string;
              description?: string;
            }[];
          });
}>;
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"name": string, "rawName": string, "description"?: undefined|string, "modifiers": {"isRepeatable": boolean, "isRequired": boolean, "isInternal": boolean, }, "value": {"specification": "boolean"|"number"|"string"|"booleanOrString", "validator"?: undefined|((value: any) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>), "completions"?: undefined|(() => Promise<{ completions: { name: string, description?: string }[] }>|{ completions: { name: string, description?: string }[] }), }, }>}
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
    isInternal: boolean;
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
    completions?:
      | undefined
      | (() =>
          | Promise<{
              completions: {
                name: string;
                description?: string;
              }[];
            }>
          | {
              completions: {
                name: string;
                description?: string;
              }[];
            });
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
 * @returns {EitherN<{"name": string, "shortDescription": string, "longDescription"?: undefined|string, "modifiers": {"isDynamic": boolean, "isCosmetic": boolean, }, "dynamicValue": {"validator"?: undefined|((value: string) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>), "completions"?: undefined|(() => Promise<{ completions: { name: string, description?: string }[] }>|{ completions: { name: string, description?: string }[] }), }, "subCommands": (import("./types").CliCommandDefinition)[], "flags": (import("./types").CliFlagDefinition)[], "executor"?: undefined|((logger: import("@compas/stdlib").Logger, state: import("../../cli/types").CliExecutorState) => (Promise<import("../../cli/types").CliResult>|CliResult)), }>}
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
  dynamicValue: {
    validator?:
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
    completions?:
      | undefined
      | (() =>
          | Promise<{
              completions: {
                name: string;
                description?: string;
              }[];
            }>
          | {
              completions: {
                name: string;
                description?: string;
              }[];
            });
  };
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

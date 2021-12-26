/**
 * @typedef {import("@compas/stdlib").AppError} AppError
 */
/**
 * @typedef {object} CliLogger
 * @property {(pretty: string, ndjson: any) => void} info
 * @property {(pretty: string, ndjson: any) => void} error
 */
/**
 * @template {{exitCode?: number }} [T={ exitCode?: number }]
 * @typedef {import("@compas/stdlib").Either<T, AppError>} CliResult
 */
/**
 * @typedef {object} CliCommandExecutorState
 * @property {CliDefinition} cli The known cli definition
 * @property {string[]} command The parsed command, can be used to figure out values of
 *   dynamic commands
 * @property {Record<string, boolean|number|string|string[]|number[]|boolean[]>} flags
 *   The values of parsed flags
 */
/**
 * @typedef {object} CliDefinition
 */
/**
 * @type {boolean}
 */
export const __types: boolean;
export type AppError = import("@compas/stdlib").AppError;
export type CliLogger = {
  info: (pretty: string, ndjson: any) => void;
  error: (pretty: string, ndjson: any) => void;
};
export type CliResult<
  T extends {
    exitCode?: number | undefined;
  } = {
    exitCode?: number | undefined;
  },
> = import("@compas/stdlib").Either<T, AppError>;
export type CliCommandExecutorState = {
  /**
   * The known cli definition
   */
  cli: CliDefinition;
  /**
   * The parsed command, can be used to figure out values of
   * dynamic commands
   */
  command: string[];
  /**
   *   The values of parsed flags
   */
  flags: Record<
    string,
    boolean | number | string | string[] | number[] | boolean[]
  >;
};
export type CliDefinition = object;
//# sourceMappingURL=types.d.ts.map

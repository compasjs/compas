/**
 * @typedef {object} LogOptions
 * @property {boolean|undefined} [disableRootEvent]
 * @property {{
 *     includeEventName?: boolean,
 *     includePath?: boolean,
 *     includeValidatedParams?: boolean,
 *     includeValidatedQuery?: boolean,
 *   }|undefined} [requestInformation]
 */
/**
 * Log basic request and response information
 *
 * @param {import("koa")} app
 * @param {LogOptions} options
 */
export function logMiddleware(
  app: import("koa"),
  options: LogOptions,
): (ctx: any, next: any) => Promise<void>;
export type LogOptions = {
  disableRootEvent?: boolean | undefined;
  requestInformation?:
    | {
        includeEventName?: boolean;
        includePath?: boolean;
        includeValidatedParams?: boolean;
        includeValidatedQuery?: boolean;
      }
    | undefined;
};
//# sourceMappingURL=log.d.ts.map

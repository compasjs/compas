/**
 * Log basic request and response information
 *
 * @param {import("koa")} app
 * @param {{ disableRootEvent?: boolean }} options
 */
export function logMiddleware(
  app: import("koa"),
  options: {
    disableRootEvent?: boolean;
  },
): (ctx: any, next: any) => Promise<void>;
//# sourceMappingURL=log.d.ts.map

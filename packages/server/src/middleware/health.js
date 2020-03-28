/**
 * Middleware that immediately returns on ANY /_health
 */
export function healthHandler() {
  return (ctx, next) => {
    if (ctx.path === "/_health") {
      ctx.body = "";
    } else {
      return next();
    }
  };
}

/**
 * Middleware that immediately returns on ANY /_health
 */
export const healthHandler = () => (ctx, next) => {
  if (ctx.path === "/_health") {
    ctx.body = "";
  } else {
    return next();
  }
};

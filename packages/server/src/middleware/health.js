/**
 * Middleware that immediately returns on ANY /_health
 */
const healthHandler = () => (ctx, next) => {
  if (ctx.path === "/_health") {
    ctx.body = "";
  } else {
    return next();
  }
};

module.exports = {
  healthHandler,
};

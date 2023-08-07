import { cors } from "./cors.js";

/**
 * @param {import("../app.js").HeaderOptions} [opts]
 */
export function defaultHeaders(opts = {}) {
  // Excerpt from default helmet headers
  // When serving static files, some extra headers should be added
  // See: https://helmetjs.github.io/docs/
  const standardHeaders = {
    "X-DNS-Prefetch-Control": "off",
    "Strict-Transport-Security": "max-age=5184000; includeSubDomains", // 60 day default
  };

  const corsExec = cors(opts.cors);

  return (ctx, next) => {
    ctx.set(standardHeaders);

    return corsExec(ctx, next);
  };
}

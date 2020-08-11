import { createServer } from "http";
import { isNil } from "@lbu/stdlib";
import proxy from "http-proxy-middleware";

/**
 * @param {Logger} logger
 * @returns {Promise<void>}
 */
export async function proxyCommand(logger) {
  const port = parseInt(
    (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "")
      .split(":")
      .pop(),
  );

  if (isNaN(port)) {
    logger.error(
      "Please set the `API_URL` or `NEXT_PUBLIC_API_URL` environment variable",
    );
    process.exit(1);
  }
  if ((process.env.PROXY_URL ?? "").length === 0) {
    logger.error("Please set the `PROXY_URL` environment variable");
    process.exit(1);
  }

  const localProxy = proxy.createProxyMiddleware({
    target: process.env.PROXY_URL,
    logProvider: getLogProvider(logger),
    changeOrigin: true,
    cookieDomainRewrite: "",
    onProxyRes: (proxyResponse) => {
      if (proxyResponse.headers["set-cookie"]) {
        const cookies = proxyResponse.headers["set-cookie"];

        // Remove secure flag since localhost connection is not secure
        for (let i = 0; i < cookies.length; ++i) {
          cookies[i] = cookies[i].replace(/; secure/gi, "");
        }
      }
    },
  });

  const allowMethods = "GET,PUT,POST,PATCH,DELETE,HEAD,OPTIONS";

  logger.info({
    message: "Starting proxy",
    target: process.env.PROXY_URL,
    port,
  });

  createServer((req, res) => {
    res.setHeader("Vary", "Origin");
    const origin = req.headers["origin"];

    // CORS handling
    if (req.method === "OPTIONS" && !isNil(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", allowMethods);
      res.setHeader(
        "Access-Control-Allow-Headers",
        req.headers["access-control-request-headers"],
      );
      res.writeHead(204);
      res.end();
    } else {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
      if (!isNil(origin)) {
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }

      // Proxy handles the other stuff
      localProxy(req, res);
    }
  }).listen(port);
}

/**
 * Noramlize all log calls into info and error calls
 * @param {Logger} logger
 * @returns {LogProvider}
 */
function getLogProvider(logger) {
  return () => ({
    log: (...args) =>
      args.length === 1 ? logger.info(args[0]) : logger.info(args),
    debug: (...args) =>
      args.length === 1 ? logger.info(args[0]) : logger.info(args),
    info: (...args) =>
      args.length === 1 ? logger.info(args[0]) : logger.info(args),
    warn: (...args) =>
      args.length === 1 ? logger.error(args[0]) : logger.error(args),
    error: (...args) =>
      args.length === 1 ? logger.error(args[0]) : logger.error(args),
  });
}

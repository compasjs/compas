import { createServer } from "http";
import { AppError, environment, isNil } from "@compas/stdlib";
import proxy from "http-proxy";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "proxy",
  shortDescription: "Proxy a remote API via localhost.",
  longDescription: `It handles CORS pre-flight requests locally and proxies all other requests to the target.

This is fully configured via environment variables:
- API_URL,NEXT_PUBLIC_API_URL: the url which is expected by your frontend. Should be in the form of 'http://localhost:$PORT'. This determines the port to listen on.
- PROXY_URL: the target used for passing the proxy-ed requests to.
`,
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @returns {import("../../cli/types.js").CliResult}
 */
export function cliExecutor(logger, state) {
  const apiUrlUsed =
    environment.API_URL ?? environment.NEXT_PUBLIC_API_URL ?? "";

  if (apiUrlUsed.length === 0) {
    logger.error(
      "Please add the `API_URL` or `NEXT_PUBLIC_API_URL` to your '.env' file.",
    );
    return {
      exitStatus: "failed",
    };
  }

  // @ts-ignore
  const port = parseInt(apiUrlUsed.split(":").pop());

  if (isNaN(port)) {
    logger.error(
      "Make sure the `API_URL` or `NEXT_PUBLIC_API_URL` is in the format `http://localhost:$port` so the proxy knows on which port to listen.",
    );
    return {
      exitStatus: "failed",
    };
  }

  if ((environment.PROXY_URL ?? "").length === 0) {
    logger.error("Please set the `PROXY_URL` environment variable");
    return {
      exitStatus: "failed",
    };
  }

  const localProxy = proxy.createProxyServer({});

  localProxy.on("proxyRes", (proxyResponse, req) => {
    if (state.flags.verbose) {
      logger.info({
        method: req.method,
        path: req.url,
        status: proxyResponse.statusCode,
        headers: proxyResponse.headers,
      });
    } else {
      logger.info({
        method: req.method,
        path: req.url,
        status: proxyResponse.statusCode,
      });
    }
  });

  const allowMethods = "GET,PUT,POST,PATCH,DELETE,HEAD,OPTIONS";
  const options = {
    target: environment.PROXY_URL,
    changeOrigin: true,
    cookieDomainRewrite: "",
  };

  logger.info(`Starting proxy localhost:${port} -> ${options.target}`);

  createServer((req, res) => {
    res.setHeader("Vary", "Origin");
    const origin = req.headers["origin"];

    // CORS handling
    if (req.method === "OPTIONS" && !isNil(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", allowMethods);

      if (req.headers["access-control-request-headers"]) {
        res.setHeader(
          "Access-Control-Allow-Headers",
          // @ts-ignore
          req.headers["access-control-request-headers"],
        );
      }

      res.writeHead(204);
      res.end();
    } else {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
      if (!isNil(origin)) {
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }

      // Proxy handles the other stuff
      // Uses a custom error handler to make sure errors are logged and responses are
      // 'ended'
      localProxy.web(req, res, options, (error) => {
        logger.error({
          message: "Proxy error",
          error: AppError.format(error),
        });

        if (res.writableEnded) {
          logger.error("Stream closed");
        } else {
          res.end(`Closed because of proxy error`);
        }
      });
    }
  }).listen(port);

  return {
    exitStatus: "keepAlive",
  };
}

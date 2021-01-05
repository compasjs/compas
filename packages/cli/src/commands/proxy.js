import { createServer } from "http";
import { environment, isNil } from "@compas/stdlib";
import proxy from "http-proxy";

/**
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @returns {Promise<void>}
 */
export async function proxyCommand(logger, command) {
  const verbose = command.arguments.indexOf("--verbose") !== -1;
  const port = parseInt(
    (environment.API_URL ?? environment.NEXT_PUBLIC_API_URL ?? "")
      .split(":")
      .pop(),
  );

  if (isNaN(port)) {
    logger.error(
      "Please set the `API_URL` or `NEXT_PUBLIC_API_URL` environment variable",
    );
    process.exit(1);
  }
  if ((environment.PROXY_URL ?? "").length === 0) {
    logger.error("Please set the `PROXY_URL` environment variable");
    process.exit(1);
  }

  const localProxy = proxy.createProxyServer({});

  localProxy.on("proxyRes", (proxyResponse, req) => {
    // Remove secure flag since localhost connection is not secure
    if (proxyResponse.headers["set-cookie"]) {
      const cookies = proxyResponse.headers["set-cookie"];

      for (let i = 0; i < cookies.length; ++i) {
        cookies[i] = cookies[i].replace(/; secure/gi, "");
      }
    }

    if (verbose) {
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

  logger.info({
    message: "Starting proxy",
    target: options.target,
    port,
    verbose,
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
      // Uses a custom error handler to make sure errors are logged and responses are
      // 'ended'
      localProxy.web(req, res, options, (error) => {
        logger.error({
          message: "Proxy error",
          error,
        });

        if (res.writableEnded) {
          logger.error("Stream closed");
        } else {
          res.end(`Closed because of proxy error`);
        }
      });
    }
  }).listen(port);
}

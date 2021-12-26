import { AppError, isPlainObject, newLogger } from "@compas/stdlib";

/**
 * Create a new logger
 *
 * @param {string} cliName
 * @param {boolean} useJSON
 * @return {import("./types").CliLogger}
 */
export function cliLoggerCreate(cliName, useJSON) {
  const logger = newLogger({
    ctx: !useJSON
      ? { type: cliName }
      : {
          type: "cli",
          application: cliName,
        },
    printer: useJSON ? "ndjson" : "pretty",
  });

  function printer(pretty, ndjson) {
    if (typeof pretty !== "string") {
      throw AppError.serverError({
        message: "Pretty printer requires strings",
        found: {
          pretty,
        },
      });
    }
    if (!isPlainObject(ndjson)) {
      throw AppError.serverError({
        message: "NDJSON printer requires plain objects",
        found: {
          ndjson,
        },
      });
    }

    return useJSON ? ndjson : pretty;
  }

  return {
    info: (...args) => logger.info(printer(...args)),
    error: (...args) => logger.error(printer(...args)),
  };
}

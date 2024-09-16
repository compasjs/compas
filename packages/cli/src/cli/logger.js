import { isProduction, newLogger } from "@compas/stdlib";

/**
 * Create a new logger
 *
 * @param {string} cliName
 * @returns {import("@compas/stdlib").Logger}
 */
export function cliLoggerCreate(cliName) {
  const logger = newLogger({
    ctx:
      !isProduction() ?
        { type: cliName }
      : {
          type: "cli",
          application: cliName,
        },
  });

  if (isProduction()) {
    return {
      info(arg) {
        if (typeof arg === "string") {
          logger.info({ message: arg });
        } else {
          logger.info(arg);
        }
      },
      error(arg) {
        if (typeof arg === "string") {
          logger.error({ message: arg });
        } else {
          logger.error(arg);
        }
      },
    };
  }

  return logger;
}

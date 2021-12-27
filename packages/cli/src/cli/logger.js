import { isProduction, newLogger } from "@compas/stdlib";

/**
 * Create a new logger
 *
 * @param {string} cliName
 * @return {import("@compas/stdlib").Logger}
 */
export function cliLoggerCreate(cliName) {
  return newLogger({
    ctx: !isProduction()
      ? { type: cliName }
      : {
          type: "cli",
          application: cliName,
        },
  });
}

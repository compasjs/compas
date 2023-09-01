import { newLogger } from "@compas/stdlib";
import { logger, loggerEnable } from "../../shared/output.js";

/**
 * Run Compas in CI mode
 *
 * @param {import("../../shared/config.js").ConfigEnvironment} env
 * @returns {Promise<void>}
 */
export function ciMode(env) {
  loggerEnable(
    newLogger({
      ctx: {
        type: env.appName,
      },
    }),
  );

  logger.info({
    message: `Starting up ${env.appName} with ${env.compasVersion} in CI.`,
  });
  logger.info({
    message:
      "Thank you for trying out the new Compas CLI. This is still a work in progress. Checkout https://github.com/compasjs/compas/issues/2774 for planned features and known issues.",
  });

  logger.info({
    message: "TODO: a future update will do more things...",
  });

  // TODO: load project

  // TODO: resolve root directories

  // TODO: for each root directory execute inferredLintCommand

  return Promise.resolve();
}

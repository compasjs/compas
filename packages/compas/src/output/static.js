import { AppError } from "@compas/stdlib";
import { debugPrint } from "./debug.js";
import { logger } from "./log.js";
import { tuiPrintInformation } from "./tui.js";

export const output = {
  config: {
    environment: {
      creating: () => {
        debugPrint("No .env file found, writing .env file.");
        tuiPrintInformation(
          "No .env file was found. Creating a default .env file.",
        );
      },
      loaded: (env) => {
        debugPrint("Loaded environment");
        debugPrint(env);

        logger.info({
          message: `Starting up ${env.appName} with ${env.compasVersion}${
            env.isCI ? " in CI" : env.isDevelopment ? " in production" : ""
          }`,
        });

        tuiPrintInformation(
          `Starting up ${env.appName} with ${env.compasVersion}...`,
        );
      },
    },
    resolve: {
      starting: () => {
        debugPrint("Resolving config");
      },
      creating: () => {
        debugPrint(
          "Did not find a config in the project root. Creating empty config.",
        );
      },
      notFound: (expectedFileLocation) => {
        debugPrint(`Could not find config at ${expectedFileLocation}.`);
        logger.error(`Could not find config at ${expectedFileLocation}.`);
        tuiPrintInformation(
          `Could not find config at ${expectedFileLocation}.`,
        );
      },
      parseError: (e, expectedFileLocation) => {
        debugPrint(
          `Parsing error in config at ${expectedFileLocation}: ${JSON.stringify(
            AppError.format(e),
          )}.`,
        );
        logger.error({
          message: "Unknown error while parsing config",
          expectedFileLocation,
          error: AppError.format(e),
        });
        tuiPrintInformation(
          `Could not parse the config in ${expectedFileLocation}.`,
        );
      },
      validationError: (error, expectedFileLocation) => {
        debugPrint(
          `Validation error while resolving config at ${expectedFileLocation}.`,
        );
        debugPrint(error);

        for (const key of Object.keys(error)) {
          const value = error[key];
          if (key === "$") {
            if (value.key === "validator.object") {
              logger.error({
                message:
                  "Expected that the config file contains at least a JSON object.",
                configFile: expectedFileLocation,
              });
              tuiPrintInformation(
                `Config file at ${expectedFileLocation} does not contain a top level object.`,
              );
            } else if (value.key === "validator.keys") {
              logger.error({
                message: "The config may only specify known keys",
                configFile: expectedFileLocation,
                unknownKeys: value.unknownKeys,
              });
              tuiPrintInformation(
                `Config file at ${expectedFileLocation} contains unknown keys which is not allowed: ${value.unknownKeys.join(
                  ", ",
                )}`,
              );
            } else {
              logger.error({
                message: "Unknown error while loading config",
                configFile: expectedFileLocation,
                error,
              });
              tuiPrintInformation(
                `Config file at ${expectedFileLocation} contains an unknown error. Run 'zakmes verify' to retrieve the raw error.`,
              );
            }
          } else if (key === "$.projects") {
            logger.error({
              message: "Unknown error while loading config",
              configFile: expectedFileLocation,
              error,
            });
            tuiPrintInformation(
              `Config file at ${expectedFileLocation} contains an invalid projects array. Run 'zakmes verify' to retrieve the raw error.`,
            );
          } else {
            logger.error({
              message: "Unknown error while loading config",
              configFile: expectedFileLocation,
              error,
            });
            tuiPrintInformation(
              `Config file at ${expectedFileLocation} contains an unknown error. Run 'zakmes verify' to retrieve the raw error.`,
            );
          }
        }
      },
      resolved: (resolvedConfig) => {
        debugPrint("Successfully resolved a config");
        debugPrint(resolvedConfig);
      },
    },
  },
};

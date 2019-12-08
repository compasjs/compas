/* eslint-disable @typescript-eslint/no-var-requires */

import { initConfig } from "@lightbase/config";
import { addTypeFilter, Logger, resetWriter } from "@lightbase/insight";

const loggerType = "LOADER";
addTypeFilter(loggerType);

export function load() {
  const logger = new Logger(3, { type: loggerType });
  logger.info("Loading modules...");
  loadDotenv(logger);

  // Make sure to reset writer if node env changes
  resetWriter();

  loadTsNode(logger);
  loadConfig(logger);
}

function loadDotenv(logger: Logger) {
  const dotenv = require("dotenv");
  dotenv.config();
  logger.info("Loaded dotenv");
}

function loadTsNode(logger: Logger) {
  if (process.env.NODE_ENV === "development") {
    try {
      require("ts-node/register");
      logger.info("Loaded ts-node");
    } catch {
      // ignore errors
    }
  }
}

function loadConfig(logger: Logger) {
  initConfig(logger);
}

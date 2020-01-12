#!/usr/bin/env node

import { Logger } from "@lbu/insight";
import { run } from "./cli";

const loggerType = "LBU:CLI";

const logger = new Logger(3, { type: loggerType });

if (require.main !== module) {
  logger.error("Only available to run via `lbu`");
  process.exit(1);
} else {
  run(logger, process.argv.slice(2)).catch(e => logger.error(e));
}

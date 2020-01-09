import { Logger } from "@lbu/insight";

const loggerType = "LBU:PKG";

const logger = new Logger(3, { type: loggerType });

logger.info("Hello");

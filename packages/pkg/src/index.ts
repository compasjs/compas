import { Logger } from "@lightbase/insight";

const loggerType = "LBF:PKG";

const logger = new Logger(3, { type: loggerType });

logger.info("Hello");

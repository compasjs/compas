import { Logger } from "@lightbase/insight";

const loggerType = "PKG";
// addTypeFilter(loggerType);

const logger = new Logger(3, { type: loggerType });

logger.info("Hello");

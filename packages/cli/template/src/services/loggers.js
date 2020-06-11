/**
 * @type {Logger}
 */
export let serviceLogger = undefined;

/**
 * @param logger
 */
export function setServiceLogger(logger) {
  logger.info("setting serviceLogger");
  serviceLogger = logger;
  return logger;
}

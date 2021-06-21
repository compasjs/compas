import { newEvent } from "@compas/stdlib";

/**
 * Create a new test event
 *
 * @since 0.1.0
 *
 * @param {TestRunner} t
 * @param {{ enableLogs?: boolean }} [options={}]
 * @returns {InsightEvent}
 */
export function newTestEvent(t, options = {}) {
  options.enableLogs = options.enableLogs ?? false;

  let logger = t.log;

  // Disable info logging
  if (!options.enableLogs) {
    logger = { ...logger, info: () => {} };
  }

  return newEvent(logger, t.signal);
}

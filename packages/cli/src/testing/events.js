import { newEvent } from "@compas/stdlib";

/**
 * Create a new test event
 *
 * @since 0.1.0
 *
 * @param {TestRunner} t
 * @returns {InsightEvent}
 */
export function newTestEvent(t) {
  return newEvent(t.log, t.signal);
}

import { newEvent } from "@compas/stdlib";

/**
 * Create a new test event
 *
 * @since 0.1.0
 *
 * @param {import("../../types/advanced-types.d.ts").TestRunner} t
 * @returns {import("@compas/stdlib").InsightEvent}
 */
export function newTestEvent(t) {
  return newEvent(t.log, t.signal);
}

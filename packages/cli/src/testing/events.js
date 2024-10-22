import { isNil, newEvent, newLogger } from "@compas/stdlib";

/**
 * Create a new test event
 *
 * @since 0.1.0
 *
 * @param {import("../../types/advanced-types.d.ts").TestRunner} [t]
 * @returns {import("@compas/stdlib").InsightEvent}
 */
export function newTestEvent(t) {
  if (!isNil(t) && typeof t === "object" && typeof t.log?.info === "function") {
    return newEvent(t.log, t.signal);
  }

  return newEvent(
    newLogger({
      ctx: {
        type: "new-test-event",
      },
    }),
  );
}

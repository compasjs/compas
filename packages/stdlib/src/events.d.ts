/**
 * Create a new event from a logger
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types.js").Logger} logger Logger should have a
 *   context, like the default `ctx.log`
 * @param {AbortSignal|undefined} [signal]
 * @returns {import("../types/advanced-types.js").InsightEvent}
 */
export function newEvent(
  logger: import("../types/advanced-types.js").Logger,
  signal?: AbortSignal | undefined,
): import("../types/advanced-types.js").InsightEvent;
/**
 * Create a 'child' event, reuses the logger, adds callstack to the passed event
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types.js").InsightEvent} event
 * @returns {import("../types/advanced-types.js").InsightEvent}
 */
export function newEventFromEvent(
  event: import("../types/advanced-types.js").InsightEvent,
): import("../types/advanced-types.js").InsightEvent;
/**
 * Track event start times
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types.js").InsightEvent} event
 * @param {string} name
 * @returns {void}
 */
export function eventStart(
  event: import("../types/advanced-types.js").InsightEvent,
  name: string,
): void;
/**
 * Rename an event, and all callStack items
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types.js").InsightEvent} event
 * @param {string} name
 * @returns {void}
 */
export function eventRename(
  event: import("../types/advanced-types.js").InsightEvent,
  name: string,
): void;
/**
 * Track event end times and log if necessary
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types.js").InsightEvent} event
 * @returns {void}
 */
export function eventStop(
  event: import("../types/advanced-types.js").InsightEvent,
): void;
//# sourceMappingURL=events.d.ts.map

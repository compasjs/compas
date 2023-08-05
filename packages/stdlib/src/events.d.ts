/**
 * Create a new event from a logger
 *
 * @since 0.1.0
 *
 * @param {import("./logger.js").Logger} logger Logger should have a
 *   context, like the default `ctx.log`
 * @param {AbortSignal|undefined} [signal]
 * @returns {InsightEvent}
 */
export function newEvent(
  logger: import("./logger.js").Logger,
  signal?: AbortSignal | undefined,
): InsightEvent;
/**
 * Create a 'child' event, reuses the logger, adds it als a child to the passed event
 *
 * @since 0.1.0
 *
 * @param {InsightEvent} event
 * @returns {InsightEvent}
 */
export function newEventFromEvent(event: InsightEvent): InsightEvent;
/**
 * Track event start times
 *
 * @since 0.1.0
 *
 * @param {InsightEvent} event
 * @param {string} name
 * @returns {void}
 */
export function eventStart(event: InsightEvent, name: string): void;
/**
 * Rename an event
 *
 * @since 0.1.0
 *
 * @param {InsightEvent} event
 * @param {string} name
 * @returns {void}
 */
export function eventRename(event: InsightEvent, name: string): void;
/**
 * Track event end times and log if necessary
 *
 * @since 0.1.0
 *
 * @param {InsightEvent} event
 * @returns {void}
 */
export function eventStop(event: InsightEvent): void;
export type InsightEventSpan = {
  name: string;
  duration?: number | undefined;
  startTime: number;
  stopTime?: number | undefined;
  abortedTime?: number | undefined;
  children: InsightEventSpan[];
};
/**
 * The insight event is a tool for tracking the duration of (async) functions manually.
 * By utilizing the insight event, you can gain access to a task or request-specific logger and
 * obtain insights into the execution time of your functions.
 *
 * How to use the Insight Event:
 *
 * Start by retrieving a root event. It can be created by calling {@link newEvent }
 * and passing it a logger. When you use the {@link getApp } from
 */
export type InsightEvent = {
  log: import("@compas/stdlib").Logger;
  signal?: AbortSignal | undefined;
  rootEvent?: InsightEvent | undefined;
  name?: string | undefined;
  span: InsightEventSpan;
};
//# sourceMappingURL=events.d.ts.map

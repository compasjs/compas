/**
 * Create a new event from a logger
 *
 * @since 0.1.0
 *
 * @param {Logger} logger Logger should have a context, like the default `ctx.log`
 * @param {AbortSignal|undefined} [signal]
 * @returns {InsightEvent}
 */
export function newEvent(logger: Logger, signal?: AbortSignal | undefined): InsightEvent;
/**
 * Create a 'child' event, reuses the logger, adds callstack to the passed event
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
 * Rename an event, and all callStack items
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
export type Logger = import("../types/advanced-types.js").Logger;
export type InsightEventCall = import("../types/advanced-types").InsightEventCall;
export type InsightEvent = import("../types/advanced-types").InsightEvent;
//# sourceMappingURL=events.d.ts.map
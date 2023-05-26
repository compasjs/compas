import { AppError } from "./error.js";
import { isNil } from "./lodash.js";

/**
 * @typedef {object} InsightEventSpan
 * @property {string} name
 * @property {number} [duration]
 * @property {number} startTime
 * @property {number} [stopTime]
 * @property {number} [abortedTime]
 * @property {InsightEventSpan[]} children
 */

/**
 * Manually track (async) function duration.
 *
 * By passing the event down through (async) functions, it facilitates a unified way to
 * have access to a task / request specific logger and insights in the duration of your
 * functions.
 *
 * @example
 *   async function userList(event) {
 *     eventStart(event, "user.list");
 *
 *     const totol = await userCount(newEventFromEvent(event));
 *     const users = await queryUser({}).exec(sql);
 *
 *     eventStop(event);
 *
 *     return { total, users };
 *   }
 *
 *   // Logs something like:
 *   // {
 *   //   name: "user.list",
 *   //   duration: 25,
 *   //   startTime: 1685000000000
 *   //   stopTime: 1685000000025
 *   //   children: [
 *   //     {
 *   //       name: "user.count",
 *   //       duration: 5,
 *   //       startTime: 1685000000010
 *   //       stopTime: 1685000000015
 *   //     }
 *   //   ]
 *   // }
 * @typedef {object} InsightEvent
 * @property {import("@compas/stdlib").Logger} log
 * @property {AbortSignal} [signal]
 * @property {InsightEvent} [rootEvent]
 * @property {string} [name]
 * @property {InsightEventSpan} span
 */

/**
 *
 * @param {import("./logger.js").Logger} logger
 * @param {AbortSignal|undefined} [signal]
 * @returns {InsightEvent}
 */
function InsightEventConstructor(logger, signal) {
  return {
    log: logger,
    signal,
    root: undefined,
    name: undefined,
    span: {
      // @ts-expect-error
      name: undefined,

      duration: undefined,

      // @ts-expect-error
      startTime: undefined,

      stopTime: undefined,
      abortedTime: undefined,
      children: [],
    },
  };
}

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
export function newEvent(logger, signal) {
  return InsightEventConstructor(logger, signal);
}

/**
 * Create a 'child' event, reuses the logger, adds it als a child to the passed event
 *
 * @since 0.1.0
 *
 * @param {InsightEvent} event
 * @returns {InsightEvent}
 */
export function newEventFromEvent(event) {
  if (event.signal?.aborted) {
    event.span.abortedTime = Date.now();

    throw AppError.serverError({
      message: "Operation aborted",
      span: getEventRoot(event).span,
    });
  }

  const newEvent = InsightEventConstructor(event.log, event.signal);

  // Add ot parent
  event.span.children.push(newEvent.span);

  // Set root
  newEvent.rootEvent = event.rootEvent ?? event;

  return newEvent;
}

/**
 * Track event start times
 *
 * @since 0.1.0
 *
 * @param {InsightEvent} event
 * @param {string} name
 * @returns {void}
 */
export function eventStart(event, name) {
  event.name = name;
  event.span.name = name;
  event.span.startTime = Date.now();

  if (event.signal?.aborted) {
    event.span.abortedTime = Date.now();

    throw AppError.serverError({
      message: "Operation aborted",
      span: getEventRoot(event).span,
    });
  }
}

/**
 * Rename an event
 *
 * @since 0.1.0
 *
 * @param {InsightEvent} event
 * @param {string} name
 * @returns {void}
 */
export function eventRename(event, name) {
  event.name = name;
  event.span.name = name;

  if (event.signal?.aborted) {
    event.span.abortedTime = Date.now();

    throw AppError.serverError({
      message: "Operation aborted",
      span: getEventRoot(event).span,
    });
  }
}

/**
 * Track event end times and log if necessary
 *
 * @since 0.1.0
 *
 * @param {InsightEvent} event
 * @returns {void}
 */
export function eventStop(event) {
  event.span.stopTime = Date.now();

  if (event.span.startTime && event.span.stopTime) {
    event.span.duration = event.span.stopTime - event.span.startTime;
  }

  if (isNil(event.rootEvent)) {
    event.log.info({
      type: "event_span",
      aborted: !!event.signal?.aborted,
      span: event.span,
    });
  }
}

/**
 * Get the root event from the provided event
 *
 * @param {InsightEvent} event
 * @returns {InsightEvent}
 */
function getEventRoot(event) {
  return isNil(event.rootEvent) ? event : event.rootEvent;
}

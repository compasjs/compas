import { AppError } from "./error.js";
import { isNil } from "./lodash.js";
import { _compasSentryExport } from "./sentry.js";

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
 * The insight event is a tool for tracking the duration of (async) functions manually.
 * By utilizing the insight event, you can gain access to a task or request-specific
 * logger and obtain insights into the execution time of your functions.
 *
 * How to use the Insight Event:
 *
 * Start by retrieving a root event. It can be created by calling {@link newEvent}
 * and passing it a logger. When you use the {@link getApp} from @compas/store,
 * it automatically adds a root event to `ctx.event`.
 * In your tests you can use {@link newTestEvent}.
 *
 * You could pass the event object down through your (async) functions as an argument.
 * This allows the insight event to associate the event with the specific task or
 * request.
 *
 * Finally, you should stop the event for correct logging by calling {@link eventStop}.
 * When the root event is stopped via {@link eventStop} it calculates the duration
 * by subtracting the start time from the end time. the event can log the start
 * and end times of the function execution if necessary.
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
 * @property {import("@sentry/node").Span} [_compasSentrySpan]
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

    _compasSentrySpan: undefined,
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

    if (event._compasSentrySpan) {
      event._compasSentrySpan.end();
    }

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

  if (typeof _compasSentryExport?.startInactiveSpan === "function") {
    event._compasSentrySpan = _compasSentryExport.startInactiveSpan({
      op: "function",
      name: name,
      description: name,
    });
  }

  if (event.signal?.aborted) {
    event.span.abortedTime = Date.now();

    if (event._compasSentrySpan) {
      event._compasSentrySpan.end();
    }

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

  if (event._compasSentrySpan) {
    event._compasSentrySpan.description = name;
    event._compasSentrySpan.updateName(name);
  }

  if (event.signal?.aborted) {
    event.span.abortedTime = Date.now();

    if (event._compasSentrySpan) {
      event._compasSentrySpan.end();
    }

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

  if (event._compasSentrySpan) {
    event._compasSentrySpan.end();
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

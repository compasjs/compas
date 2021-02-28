import { inspect } from "util";

/**
 * Nested timing and call information
 *
 * @typedef {InsightEventCallObject|(InsightEventCall[])} InsightEventCall
 */

/**
 * Basic timing and call information
 *
 * @typedef {object} InsightEventCallObject
 * @property {"start"|"stop"} type
 * @property {string} name
 * @property {number} time Time in milliseconds since some epoch. This can either be the
 *    unix epoch or process start
 */

/**
 * Encapsulate information needed to store events
 *
 * @typedef {object} InsightEvent
 * @property {Logger} log
 * @property {AbortSignal|undefined} signal
 * @property {boolean} root Check if the event is the root event in the chain
 * @property {string|undefined} [name]
 * @property {InsightEventCall[]} callStack
 */

/**
 * Create a new event from a logger
 *
 * @since 0.1.0
 *
 * @param {Logger} logger Logger should have a context, like the default `ctx.log`
 * @param {AbortSignal|undefined} [signal]
 * @returns {InsightEvent}
 */
export function newEvent(logger, signal) {
  return {
    log: logger,
    signal,
    root: true,
    name: undefined,
    callStack: [],
  };
}

/**
 * Create a 'child' event, reuses the logger, adds callstack to the passed event
 *
 * @since 0.1.0
 *
 * @param {InsightEvent} event
 * @returns {InsightEvent}
 */
export function newEventFromEvent(event) {
  const callStack = [];
  event.callStack.push(callStack);

  if (event.signal?.aborted) {
    throw new TimeoutError(event);
  }

  return {
    log: event.log,
    signal: event.signal,
    root: false,
    name: undefined,
    callStack,
  };
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

  if (event.signal?.aborted) {
    throw new TimeoutError(event);
  }

  event.callStack.push({
    type: "start",
    name,
    time: Date.now(),
  });
}

/**
 * Rename an event, can only be done if `eventStop` is not called yet.
 *
 * @since 0.1.0
 *
 * @param {InsightEvent} event
 * @param {string} name
 * @returns {void}
 */
export function eventRename(event, name) {
  event.name = name;
  event.callStack[0].name = name;

  if (event.signal?.aborted) {
    throw new TimeoutError(event);
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
  event.callStack.push({
    type: "stop",
    name: event.name,
    time: Date.now(),
  });

  if (event.root) {
    event.log.info({
      type: "event_callstack",
      callStack: event.callStack,
    });
  }
}

/**
 * Timeout error, shaped like an @compas/stdlib AppError
 *
 * @since 0.1.0
 * @class
 */
export class TimeoutError extends Error {
  /**
   *
   * @param {InsightEvent} event
   */
  constructor(event) {
    super();

    this.key = "error.server.internal";
    this.status = 500;
    this.info = {
      message: "Operation aborted",
      event,
    };

    Object.setPrototypeOf(this, TimeoutError.prototype);
  }

  /**
   * Format as object when the TimeoutError is passed to console.log / console.error.
   * This works because it uses `util.inspect` under the hood.
   * Util#inspect checks if the Symbol `util.inspect.custom` is available.
   */
  [inspect.custom]() {
    return {
      key: this.key,
      status: this.status,
      info: this.info,
    };
  }

  /**
   * Format as object when the TimeoutError is passed to JSON.stringify().
   * This is used in the compas insight logger in production mode.
   */
  toJSON() {
    return {
      key: this.key,
      status: this.status,
      info: this.info,
    };
  }
}

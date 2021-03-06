import { inspect } from "util";
import { AppError } from "./error.js";
import { isNil } from "./lodash.js";

/**
 * Nested timing and call information
 *
 * @typedef {InsightEventCallObject|(InsightEventCall[])} InsightEventCall
 */

/**
 * Basic timing and call information
 *
 * @typedef {object} InsightEventCallObject
 * @property {"start"|"stop"|"aborted"} type
 * @property {string} name
 * @property {number|undefined} [duration] Duration in milliseconds between (end|aborted)
 *    and start time. This is filled when an event is aborted or stopped via `eventStop`.
 * @property {number} time Time in milliseconds since some epoch. This can either be the
 *    unix epoch or process start
 */

/**
 * @class
 *
 * @param {Logger} logger
 * @param {AbortSignal|undefined} [signal]
 * @returns {InsightEvent}
 */
function InsightEvent(logger, signal) {
  if (!(this instanceof InsightEvent)) {
    return new InsightEvent(logger, signal);
  }

  const _this = this;

  /**  @type {Logger} */
  this.log = logger;
  /**  @type {AbortSignal|undefined} */
  this.signal = signal;
  /**  @type {InsightEvent|undefined} */
  this.parent = undefined;
  /**  @type {string|undefined} */
  this.name = undefined;
  /**  @type {InsightEventCall[]} */
  this.callStack = [];

  this.calculateDuration = calculateDuration.bind(this);
  this[inspect.custom] = print.bind(this);
  this.toJSON = print.bind(this);

  function calculateDuration() {
    if (_this.callStack[0]?.type !== "start") {
      return;
    }

    const lastIdx = _this.callStack.length - 1;
    const lastType = _this.callStack[lastIdx]?.type;

    if (lastType === "stop" || lastType === "aborted") {
      _this.callStack[0].duration =
        _this.callStack[lastIdx].time - _this.callStack[0].time;
    }
  }

  function print() {
    return {
      type: "event_callstack",
      aborted: !!_this.signal?.aborted,
      callStack: _this.callStack,
    };
  }

  return this;
}

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
  return new InsightEvent(logger, signal);
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
  if (event.signal?.aborted) {
    event.callStack.push({
      type: "aborted",
      name: event.name,
      time: Date.now(),
    });
    event.calculateDuration();
    throw AppError.serverError({
      message: "Operation aborted",
      event: getEventRoot(event).toJSON(),
    });
  }

  const callStack = [];
  event.callStack.push(callStack);

  const newEvent = new InsightEvent(event.log, event.signal);
  newEvent.callStack = callStack;
  newEvent.root = event;

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

  if (event.signal?.aborted) {
    event.callStack.push({
      type: "aborted",
      name: event.name,
      time: Date.now(),
    });
    throw AppError.serverError({
      message: "Operation aborted",
      event: getEventRoot(event).toJSON(),
    });
  }

  event.callStack.push({
    type: "start",
    name,
    time: Date.now(),
  });
}

/**
 * Rename an event, and all callStack items
 *
 * @since 0.1.0
 *
 * @param {InsightEvent} event
 * @param {string} name
 * @returns {void}
 */
export function eventRename(event, name) {
  event.name = name;

  for (const item of event.callStack) {
    if (typeof item.name === "string") {
      item.name = name;
    }
  }

  if (event.signal?.aborted) {
    event.callStack.push({
      type: "aborted",
      name: event.name,
      time: Date.now(),
    });
    event.calculateDuration();
    throw AppError.serverError({
      message: "Operation aborted",
      event: getEventRoot(event).toJSON(),
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
  event.callStack.push({
    type: "stop",
    name: event.name,
    time: Date.now(),
  });
  event.calculateDuration();

  if (isNil(event.root)) {
    event.log.info(event);
  }
}

/**
 * Get the root event from the provided event
 * @param {InsightEvent} event
 * @returns {InsightEvent}
 */
function getEventRoot(event) {
  return isNil(event.parent) ? event : getEventRoot(event.parent);
}

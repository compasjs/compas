import { inspect } from "util";
import { AppError } from "./error.js";
import { isNil } from "./lodash.js";

/**
 *
 * @param {import("./logger.js").Logger} logger
 * @param {AbortSignal|undefined} [signal]
 * @returns {InsightEventConstructor}
 */
function InsightEventConstructor(logger, signal) {
  if (!(this instanceof InsightEventConstructor)) {
    return new InsightEventConstructor(logger, signal);
  }

  const _this = this;

  /**  @type {import("./logger.js").Logger} */
  this.log = logger;
  /**  @type {AbortSignal|undefined} */
  this.signal = signal;
  /**  @type {InsightEventConstructor|undefined} */
  this.parent = undefined;
  /**  @type {string|undefined} */
  this.name = undefined;
  /**  @type {import("../types/advanced-types.js").InsightEventCall[]} */
  this.callStack = [];

  this.calculateDuration = calculateDuration.bind(this);
  this[inspect.custom] = print.bind(this);
  this.toJSON = print.bind(this);

  function calculateDuration() {
    // @ts-ignore
    if (_this.callStack[0]?.type !== "start") {
      return;
    }

    const lastIdx = _this.callStack.length - 1;
    // @ts-ignore
    const lastType = _this.callStack[lastIdx]?.type;

    if (lastType === "stop" || lastType === "aborted") {
      // @ts-ignore
      _this.callStack[0].duration = // @ts-ignore
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
 * @param {import("./logger.js").Logger} logger Logger should have a
 *   context, like the default `ctx.log`
 * @param {AbortSignal|undefined} [signal]
 * @returns {import("../types/advanced-types.js").InsightEvent}
 */
export function newEvent(logger, signal) {
  return new InsightEventConstructor(logger, signal);
}

/**
 * Create a 'child' event, reuses the logger, adds callstack to the passed event
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types.js").InsightEvent} event
 * @returns {import("../types/advanced-types.js").InsightEvent}
 */
export function newEventFromEvent(event) {
  if (event.signal?.aborted) {
    event.callStack.push({
      type: "aborted",
      name: event.name,
      time: Date.now(),
    });
    // @ts-ignore
    event.calculateDuration();
    throw AppError.serverError({
      message: "Operation aborted", // @ts-ignore
      event: getEventRoot(event).toJSON(),
    });
  }

  const callStack = [];
  event.callStack.push(callStack);

  const newEvent = new InsightEventConstructor(event.log, event.signal);
  newEvent.callStack = callStack;
  // @ts-ignore
  newEvent.root = event;

  return newEvent;
}

/**
 * Track event start times
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types.js").InsightEvent} event
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
      message: "Operation aborted", // @ts-ignore
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
 * @param {import("../types/advanced-types.js").InsightEvent} event
 * @param {string} name
 * @returns {void}
 */
export function eventRename(event, name) {
  event.name = name;

  for (const item of event.callStack) {
    // @ts-ignore
    if (typeof item.name === "string") {
      // @ts-ignore
      item.name = name;
    }
  }

  if (event.signal?.aborted) {
    event.callStack.push({
      type: "aborted",
      name: event.name,
      time: Date.now(),
    });
    // @ts-ignore
    event.calculateDuration();
    throw AppError.serverError({
      message: "Operation aborted", // @ts-ignore
      event: getEventRoot(event).toJSON(),
    });
  }
}

/**
 * Track event end times and log if necessary
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types.js").InsightEvent} event
 * @returns {void}
 */
export function eventStop(event) {
  event.callStack.push({
    type: "stop",
    name: event.name,
    time: Date.now(),
  });

  // @ts-ignore
  event.calculateDuration();

  // @ts-ignore
  if (isNil(event.root)) {
    event.log.info(event);
  }
}

/**
 * Get the root event from the provided event
 *
 * @param {import("../types/advanced-types.js").InsightEvent} event
 * @returns {import("../types/advanced-types.js").InsightEvent}
 */
function getEventRoot(event) {
  return isNil(event.parent) ? event : getEventRoot(event.parent);
}

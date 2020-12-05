import { newLogger } from "@compas/insight";

/**
 * Create a new event from a single logger
 *
 * @param {Logger} logger Logger should have a context, like the default `ctx.log`
 * @returns {Event}
 */
export function newEvent(logger) {
  return {
    log: logger,
    root: true,
    name: undefined,
    callStack: [],
  };
}

/**
 * Create a 'child' event, reuses the logger, adds callstack to the passed event
 *
 * @param {Event} event
 * @returns {Event}
 */
export function newEventFromEvent(event) {
  const callStack = [];
  event.callStack.push(callStack);
  return {
    log: event.log,
    root: false,
    name: undefined,
    callStack,
  };
}

/**
 * Track event start times
 *
 * @param {Event} event
 * @param {string} name
 */
export function eventStart(event, name) {
  event.name = name;

  event.callStack.push({
    type: "start",
    name,
    time: Date.now(),
  });
}

/**
 * Rename an event, can only be done if `eventStop` is not called yet.
 *
 * @param {Event} event
 * @param {string} name
 */
export function eventRename(event, name) {
  event.name = name;
  event.callStack[0].name = name;
}

/**
 * Track event end times and log if necessary
 *
 * @param {Event} event
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
 * Create a new test event
 * @param {{ enableLogs?: boolean }} [options={}]
 * @return {Event}
 */
export function newTestEvent(options = {}) {
  const log = newLogger({ ctx: { type: "test-event" } });

  options.enableLogs = options.enableLogs ?? false;

  // Disable logging by default
  if (!options.enableLogs) {
    log.info = () => {};
  }

  return {
    log,
    root: true,
    name: undefined,
    callStack: [],
  };
}

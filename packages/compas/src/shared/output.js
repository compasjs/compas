import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { noop } from "@compas/stdlib";
import { writeFileChecked } from "./fs.js";

const DEBUG_LOCATION = `.cache/compas/debug-${String(Date.now()).slice(
  0,
  -3,
)}.txt`;

/**
 * We either don't know yet if the debug logs should be printed, or it is
 * enabled/disabled.
 *
 * @type {boolean|undefined}
 */
let shouldOutputDebugInfo = undefined;

/**
 * Keep track of debug logs added before we know if the debug system is enabled.
 *
 * @type {string[]}
 */
const inMemoryDebugOutput = [];

/**
 * Debug timers to keep track of performance with millisecond precision using Date.now().
 *
 * @type {Record<string, number>}
 */
const activeTimers = {};

/**
 * Default logger, consisting of noop's
 */
const noopLogger = {
  info: noop,
  error: noop,
};

/**
 * \@compas/stdlib Logger to use for pretty printing in normal scenario's. Shouldn't be
 * used in combination with the TUI.
 *
 * Note that a 'noop' logger is used as long as {@link loggerEnable} is not called.
 *
 * @type {import("@compas/stdlib").Logger}
 */
export let logger = noopLogger;

/**
 * Set the logger.
 *
 * @param {import("@compas/stdlib").Logger} setLogger
 */
export function loggerEnable(setLogger) {
  logger = setLogger;
}

/**
 * Appends the provided contents with a timestamp to {@link DEBUG_LOCATION}.
 *
 * If the contents aren't a string, they're converted to a string using
 * {@link JSON.stringify}.
 *
 * Note that this function is pretty inefficient, calling `appendFileSync` on every call.
 * We may want to optimize this at some point.
 *
 * @param {*} contents
 */
export function debugPrint(contents) {
  if (shouldOutputDebugInfo === false) {
    // Debug logs are disabled
    return;
  }

  if (typeof contents !== "string") {
    contents = JSON.stringify(contents);
  } else {
    contents = contents.trim();
  }

  // Add a date so we know what's up.
  const outputString = `${new Date().toISOString()} :: ${contents}`;

  if (shouldOutputDebugInfo === true) {
    if (!existsSync(DEBUG_LOCATION)) {
      // File is removed for some reason...
      const dir = DEBUG_LOCATION.split("/").slice(0, -1).join("/");

      mkdirSync(dir, { recursive: true });
    }

    appendFileSync(DEBUG_LOCATION, `${outputString}\n`, {});
  } else {
    inMemoryDebugOutput.push(outputString);
  }
}

/**
 * Start a time mark, which can be ended with {@link debugTimeEnd}. Overwrites any
 * existing time mark with the same label.
 *
 * @param {string} label
 */
export function debugTimeStart(label) {
  if (shouldOutputDebugInfo === false) {
    // Debug logs are disabled
    return;
  }

  activeTimers[label] = Date.now();
}

/**
 * Log the milliseconds that elapsed since the time mark set by {@link
 * debugTimeStart}. Labels can be ended multiple times, resulting in multiple debug logs.
 *
 * @param {string} label
 */
export function debugTimeEnd(label) {
  if (shouldOutputDebugInfo === false) {
    // Debug logs are disable

    return;
  }

  if (!activeTimers[label]) {
    // Ignore if start is not called.
    return;
  }

  debugPrint(`${label}: ${Date.now() - activeTimers[label]}ms`);
}

/**
 * Enable writing debug info to the debug file.
 */
export async function debugEnable() {
  if (shouldOutputDebugInfo === true) {
    return;
  }

  await writeFileChecked(
    DEBUG_LOCATION,
    inMemoryDebugOutput.length > 0 ? `${inMemoryDebugOutput.join("\n")}\n` : "",
  );

  shouldOutputDebugInfo = true;
  inMemoryDebugOutput.splice(0, inMemoryDebugOutput.length);
}

/**
 * Disable writing debug info to a debug file.
 *
 * This function should be called, so {@link debugPrint} will short circuit and not keep
 * debug logs in memory.
 */
export function debugDisable() {
  shouldOutputDebugInfo = false;
  inMemoryDebugOutput.splice(0, inMemoryDebugOutput.length);
}

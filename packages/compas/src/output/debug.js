import { appendFileSync } from "node:fs";

const DEBUG_LOCATION = `.cache/compas-debug-${String(Date.now()).slice(
  0,
  -3,
)}.txt`;

/**
 * We either don't know yet if the debug logs should be printed, or it is
 * enabled/disabled.
 *
 * @type {boolean|undefined}
 */
let writeDebugOutputToFile = undefined;

/**
 * Keep track of debug logs added before we know if the debug system is enabled.
 *
 * @type {string[]}
 */
const tempBufferTillDebugIsSet = [];

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
  if (writeDebugOutputToFile === false) {
    // Debug logs are disabled
    return;
  }

  if (typeof contents !== "string") {
    contents = JSON.stringify(contents);
  } else {
    contents = contents.trim();
  }

  // Add a date so we know what's up.
  const outputString = `${new Date().toISOString()} - ${contents}`;

  if (writeDebugOutputToFile === true) {
    appendFileSync(DEBUG_LOCATION, `${outputString}\n`, {});
  } else {
    tempBufferTillDebugIsSet.push(outputString);
  }
}

/**
 * Enable writing debug info to the debug file.
 */
export function debugEnable() {
  // Write local cache
  appendFileSync(DEBUG_LOCATION, `${tempBufferTillDebugIsSet.join("\n")}\n`);

  writeDebugOutputToFile = true;
  tempBufferTillDebugIsSet.splice(0, tempBufferTillDebugIsSet.length);
}

/**
 * Disable writing debug info to a debug file.
 *
 * This function should be called, so {@link debugPrint} will short circuit and not keep
 * debug logs in memory.
 */
export function debugDisable() {
  writeDebugOutputToFile = false;
  tempBufferTillDebugIsSet.splice(0, tempBufferTillDebugIsSet.length);
}

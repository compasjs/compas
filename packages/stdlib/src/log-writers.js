import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import { inspect } from "node:util";

/**
 * @param {NodeJS.WritableStream} stream
 * @param {string} level
 * @param {Date} timestamp
 * @param {string} context
 * @param {*} message
 * @returns {void}
 */
export function loggerWritePretty(stream, level, timestamp, context, message) {
  stream.write(`${loggerFormatPretty(level, timestamp, context, message)}\n`);
}

/**
 * @param {NodeJS.WritableStream} stream
 * @param {string} level
 * @param {Date} timestamp
 * @param {string} context
 * @param {*} message
 * @returns {void}
 */
export function loggerWriteGithubActions(
  stream,
  level,
  timestamp,
  context,
  message,
) {
  if (level === "error") {
    // file=app.js,line=10,col=15
    const { relativePath, column, line } = loggerGetCaller();

    // See https://github.com/actions/toolkit/issues/193#issuecomment-605394935 for the
    // replace hack
    stream.write(
      `::error file=${relativePath},line=${line},col=${column}::${loggerFormatPretty(
        undefined, // Always an error
        timestamp,
        context,
        message,
      )
        .replace(/\n/g, "%0A")

        // Removes ansi color codes from logs
        // eslint-disable-next-line no-control-regex
        .replace(/\u001b\[.*?m/g, "")}\n`,
    );
  } else {
    loggerWritePretty(stream, level, timestamp, context, message);
  }
}

/**
 * @param {string|undefined} level
 * @param {Date} timestamp
 * @param {string|any} context
 * @param {*} message
 * @returns {string}
 */
export function loggerFormatPretty(level, timestamp, context, message) {
  let prefix = level
    ? `${loggerFormatDate(timestamp)} ${loggerFormatLevel(
        level,
        context?.type,
      )} `
    : "";

  if (Object.keys(context).length > (context?.type ? 1 : 0)) {
    prefix += `${loggerFormatMessagePretty(context)} `;
  }

  if (message) {
    return `${prefix + loggerFormatMessagePretty(message)}`;
  }

  return prefix;
}

/**
 * @param {*} value
 * @returns {string}
 */
function loggerFormatMessagePretty(value) {
  if (
    typeof value === "boolean" ||
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  return inspect(value, {
    colors: true,
    depth: null,
  });
}

/**
 * @param {Date} date
 * @returns {string}
 */
function loggerFormatDate(date) {
  const h = date.getHours().toString(10).padStart(2, "0");
  const m = date.getMinutes().toString(10).padStart(2, "0");
  const s = date.getSeconds().toString(10).padStart(2, "0");
  const ms = date.getMilliseconds().toString(10).padStart(3, "0");

  return `${h}:${m}:${s}.${ms}`;
}

/**
 * @param {string} level
 * @param {string} type
 * @returns {string}
 */
function loggerFormatLevel(level, type) {
  const str =
    typeof type === "string" && type.length > 0 ? `${level}[${type}]` : level;

  return level === "error"
    ? `\x1b[31m${str}\x1b[39m`
    : `\x1b[34m${str}\x1b[39m`;
}

/**
 * Get the caller of the error function, by parsing the stack. May fail
 *
 * @returns {{
 *    relativePath: string,
 *    line: number,
 *    column: number,
 * }}
 */
function loggerGetCaller() {
  const err = {};
  Error.captureStackTrace(err);

  const stackLines = err.stack.split("\n").slice(1);

  let callerStackLine = stackLines[0].trim();
  for (const line of stackLines) {
    if (
      line.includes("loggerGetCaller") ||
      line.includes("loggerWriteGithubActions") ||
      line.includes("Object.write") ||
      line.includes("Object.error") ||
      line.includes("Pino.")
    ) {
      continue;
    }

    callerStackLine = line.trim();
    break;
  }

  const rawLocation =
    callerStackLine.split(" ")[callerStackLine.includes(" async ") ? 3 : 2];

  if (callerStackLine.length === 0 || (rawLocation?.length ?? 0) < 5) {
    return {
      relativePath: rawLocation,
      line: 1,
      column: 1,
    };
  }

  const rawLocationParts = rawLocation
    .substring(1, rawLocation.length - 1)
    .split(":");

  const rawFile = rawLocationParts
    .splice(0, rawLocationParts.length - 2)
    .join(":");

  return {
    relativePath: relative(process.cwd(), fileURLToPath(rawFile)),
    line: rawLocationParts[0],
    column: rawLocationParts[1],
  };
}

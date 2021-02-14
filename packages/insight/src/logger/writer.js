import { inspect } from "util";

/**
 * @param {NodeJS.WritableStream} stream
 * @param {string} level
 * @param {Date} timestamp
 * @param {string} context
 * @param {*} message
 * @returns {undefined}
 */
export function writeNDJSON(stream, level, timestamp, context, message) {
  stream.write(
    `{"level": "${level}", "timestamp": "${timestamp.toISOString()}", "context": ${context}, "message": ${JSON.stringify(
      message,
    )}}\n`,
  );
}

/**
 * @param {NodeJS.WritableStream} stream
 * @param {string} level
 * @param {Date} timestamp
 * @param {string} context
 * @param {*} message
 * @returns {undefined}
 */
export function writePretty(stream, level, timestamp, context, message) {
  let prefix = `${formatDate(timestamp)} ${formatLevelAndType(
    level,
    context?.type,
  )}`;

  if (message) {
    prefix += " ";
    if (Array.isArray(message)) {
      stream.write(
        `${prefix + message.map((it) => formatMessagePretty(it)).join(", ")}\n`,
      );
    } else {
      let keyCount = 0;
      if (context?.type) {
        // Dynamic conditional for context writing
        keyCount = 1;
      }

      if (Object.keys(context).length > keyCount) {
        prefix += `${formatMessagePretty(context)} `;
      }
      stream.write(`${prefix + formatMessagePretty(message)}\n`);
    }
  }
}

/**
 * @param {*} value
 * @returns {string}
 */
function formatMessagePretty(value) {
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
function formatDate(date) {
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
function formatLevelAndType(level, type) {
  const str =
    typeof type === "string" && type.length > 0 ? `${level}[${type}]` : level;

  return level === "error"
    ? `\x1b[31m${str}\x1b[39m`
    : `\x1b[34m${str}\x1b[39m`;
}

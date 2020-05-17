import { inspect } from "util";

export function writeNDJSON(stream, depth, level, timestamp, context, message) {
  stream.write(
    JSON.stringify({
      level,
      ...context,
      timestamp: timestamp.toISOString(),
      message: formatMessage(depth, message),
    }),
  );
  stream.write("\n");
}

export function writePretty(stream, depth, level, timestamp, context, message) {
  stream.write(formatDate(timestamp));
  stream.write(" ");
  stream.write(formatLevelAndType(level, context?.type));

  if (message) {
    stream.write(" ");
    if (Array.isArray(message)) {
      stream.write(
        message.map((it) => formatMessagePretty(depth - 2, it)).join(", "),
      );
    } else {
      if (Object.keys(context).length > 0) {
        stream.write(formatMessagePretty(depth - 1, context));
        stream.write(" ");
      }
      stream.write(formatMessagePretty(depth - 1, message));
    }
  }

  stream.write("\n");
}

/**
 * @param {number} depth
 * @param {*} value
 * @returns {string}
 */
function formatMessagePretty(depth, value) {
  if (
    typeof value === "boolean" ||
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  } else {
    return inspect(value, {
      colors: true,
      depth,
    });
  }
}

/**
 * @param {number} availableDepth
 * @param {*} message
 * @returns {*}
 */
function formatMessage(availableDepth, message) {
  if (message === null) {
    return null;
  }
  if (message === undefined) {
    return undefined;
  }

  const type = typeof message;
  if (type === "string" || type === "boolean" || type === "number") {
    return message;
  }

  if (type === "bigint" || type === "symbol") {
    return message.toString();
  } else if (type === "function") {
    return formatMessage(availableDepth, {
      name: message.name || "fn",
      length: message.length || 0,
    });
  }

  if (availableDepth === 0) {
    if (Array.isArray(message)) {
      return `[...]`;
    } else {
      return `{...}`;
    }
  }

  if (Array.isArray(message)) {
    let result = Array(message.length);
    for (let i = 0; i < message.length; ++i) {
      result[i] = formatMessage(availableDepth - 1, message[i]);
    }
    return result;
  }

  // Handle classes & objects
  const keys =
    typeof message === "object" &&
    message.constructor === Object &&
    Object.prototype.toString.call(message) === "[object Object]"
      ? Object.keys(message)
      : Object.getOwnPropertyNames(message);

  const result = {};
  for (const key of keys) {
    result[key] = formatMessage(availableDepth - 1, message[key]);
  }

  return result;
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

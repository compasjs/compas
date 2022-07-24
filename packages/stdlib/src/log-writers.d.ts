/**
 * @param {NodeJS.WritableStream} stream
 * @param {string} level
 * @param {Date} timestamp
 * @param {string} context
 * @param {*} message
 * @returns {void}
 */
export function loggerWritePretty(
  stream: NodeJS.WritableStream,
  level: string,
  timestamp: Date,
  context: string,
  message: any,
): void;
/**
 * @param {NodeJS.WritableStream} stream
 * @param {string} level
 * @param {Date} timestamp
 * @param {string} context
 * @param {*} message
 * @returns {void}
 */
export function loggerWriteGithubActions(
  stream: NodeJS.WritableStream,
  level: string,
  timestamp: Date,
  context: string,
  message: any,
): void;
/**
 * @param {string|undefined} level
 * @param {Date} timestamp
 * @param {string|any} context
 * @param {*} message
 * @returns {string}
 */
export function loggerFormatPretty(
  level: string | undefined,
  timestamp: Date,
  context: string | any,
  message: any,
): string;
//# sourceMappingURL=log-writers.d.ts.map

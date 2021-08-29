/**
 * @param {NodeJS.WritableStream} stream
 * @param {string} level
 * @param {Date} timestamp
 * @param {string} context
 * @param {*} message
 * @returns {void}
 */
export function writeNDJSON(
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
export function writePretty(
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
export function writeGithubActions(
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
export function formatPretty(
  level: string | undefined,
  timestamp: Date,
  context: string | any,
  message: any,
): string;
//# sourceMappingURL=writer.d.ts.map

import pump from "pump";
import split from "split2";
import { Transform } from "stream";

/**
 * @name LogParserContext
 *
 * @typedef {object}
 * @property {(function(data: object): undefined)} [jsonProcessor]
 * @property {(function(data: string): undefined)} [textProcessor]
 * @property {ReadStream} stream
 */

/**
 * Create a new parser context
 * @param {ReadStream} stream
 * @return {LogParserContext}
 */
export function newLogParserContext(stream) {
  return {
    jsonProcessor: undefined,
    textProcessor: undefined,
    stream,
  };
}

/**
 * Run the parser, splits the in stream onn lines and call either the jsonProcessor or
 * textProcessor with the value. The original value is written to the returned stream
 * @param {LogParserContext} lpc
 * @return {ReadStream}
 */
export function executeLogParser(lpc) {
  const transport = new Transform({
    transform(chunk, enc, cb) {
      if (chunk !== null && chunk !== undefined && chunk.length !== 0) {
        const str = chunk.toString();
        if (str.length > 0) {
          callProcessor(lpc, str);
        }
        cb(null, str + "\n");
      } else {
        cb();
      }
    },
  });

  return pump(lpc.stream, split(), transport);
}

/**
 * Internal try to parse as json and execute jsonProcessor, else execute textProcessor
 * @param {LogParserContext} lpc
 * @param {string} line
 */
function callProcessor(lpc, line) {
  let obj = undefined;

  try {
    obj = JSON.parse(line);
  } catch {
    if (lpc.textProcessor) {
      lpc.textProcessor(line);
    }
    return;
  }

  if (
    obj === undefined ||
    Object.prototype.toString.call(obj) !== "[object Object]"
  ) {
    if (lpc.textProcessor) {
      lpc.textProcessor(line);
    }
  } else {
    if (lpc.jsonProcessor) {
      lpc.jsonProcessor(obj);
    }
  }
}

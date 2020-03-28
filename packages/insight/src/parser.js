import pump from "pump";
import split from "split2";
import { Transform } from "stream";

const jsonProcessors = new Set();
const textProcessors = new Set();

/**
 * Add new processors
 * @param {"JSON"|"TEXT"} type
 * @param {function} processor
 */
export function addProcessor(type, processor) {
  if (type === "JSON") {
    jsonProcessors.add(processor);
  } else {
    textProcessors.add(processor);
  }
}

/**
 * Run parser on inStream
 * Returns a stream with original contents of inStream
 * Note that this is mostly useful with production logs
 * @param inStream
 * @return {void|*}
 */
export function parseExec(inStream = process.stdin) {
  const transport = new Transform({
    transform(chunk, enc, cb) {
      const line = processLine(chunk);
      if (line === undefined) {
        return cb();
      }
      cb(null, line);
    },
  });

  return pump(inStream, split(), transport);
}

function processJson(obj) {
  for (const p of jsonProcessors) {
    p(obj);
  }
}

function processText(txt) {
  for (const p of textProcessors) {
    p(txt);
  }
}

function processLine(line) {
  const l = line.toString();
  let j = undefined;

  if (!l) {
    return;
  }

  try {
    j = JSON.parse(l);
  } catch {
    processText(l);
    return l + "\n";
  }

  if (
    j === undefined ||
    Object.prototype.toString.call(j) !== "[object Object]"
  ) {
    processText(l);
    return l + "\n";
  }

  processJson(j);
  return l + "\n";
}

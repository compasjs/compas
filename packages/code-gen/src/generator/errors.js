import { getHashForString } from "../utils.js";

/**
 * If errors are present, they are printed and the process is exited.
 * Else this function will just return
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function exitOnErrorsOrReturn(context) {
  const errorHashes = new Set();
  const skippedErrors = [];

  for (let i = 0; i < context.errors.length; ++i) {
    const hash = getHashForString(JSON.stringify(context.errors[i]));
    if (errorHashes.has(hash)) {
      skippedErrors.push(i);
      continue;
    }

    errorHashes.add(hash);
  }

  for (const removeIdx of skippedErrors.reverse()) {
    context.errors.splice(removeIdx, 1);
  }

  if (context.errors.length === 0) {
    return;
  }

  const formatArray = [""];

  for (let i = 0; i < context.errors.length; i++) {
    /** @type {import("../generated/common/types").CodeGenCollectableError} */
    const error = context.errors[i];
    formatArray.push(
      formatErrorString(error.errorString, {
        i,
        length: context.errors.length,
      }),
    );
  }

  // @ts-ignore
  context.logger.error(formatArray.join("\n"));
  process.exit(1);
}

function formatErrorString(str, { i, length }) {
  const prefix = `- (${String(i + 1).padStart(
    String(length).length,
    " ",
  )}/${length}): `;
  const lines = str.split("\n").map((it) => it.trim());

  lines[0] = prefix + lines[0];
  for (let j = 0; j < lines.length; j++) {
    if (j === 0) {
      continue;
    }

    lines[j] = `  ${lines[j]}`;
  }

  return lines.join("\n");
}

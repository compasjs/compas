/**
 *
 * @param {string} input
 * @returns {string}
 */
function partialEndWithNewline(input) {
  return input.endsWith("\n") ? input : `${input}\n`;
}

/**
 * @param {string|string[]|(string|string[])[]} input
 */
export const partialAsString = (input) =>
  Array.isArray(input)
    ? input
        .flat(Infinity)
        .map((it) => partialEndWithNewline(it))
        .join("")
    : partialEndWithNewline(input);

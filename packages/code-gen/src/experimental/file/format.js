/**
 * Format the provided contents as an inline comment for the specific file.
 * This means that we will most of the time try to use inline comment syntax.
 *
 * This works on `type` declarations in Typescript. However, this shouldn't be
 * used in places where JSDoc is necessary.
 *
 * @param {import("./context").GenerateFile} file
 * @param {string} contents
 * @returns {string}
 */
export function fileFormatInlineComment(file, contents) {
  return `${file.inlineCommentPrefix}${contents.replace(
    /\n/g,
    `\n${file.inlineCommentPrefix}`,
  )}`;
}

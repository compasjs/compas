/**
 * Start a new block. This system can only be used for targets that use `{` and `}`
 * around if-blocks, etc.
 *
 * @param {import("./context.js").GenerateFile} file
 * @param {string} contents
 * @returns {void}
 */
export function fileBlockStart(
  file: import("./context.js").GenerateFile,
  contents: string,
): void;
/**
 * End a block, dedent the file.
 *
 * @param {import("./context.js").GenerateFile} file
 * @returns {void}
 */
export function fileBlockEnd(file: import("./context.js").GenerateFile): void;
//# sourceMappingURL=block.d.ts.map

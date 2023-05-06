/**
 * Add a placeholder for writing the imports when finalizing the file. Not all files have
 * a imports, so we only add the placeholder when the file has an importCollector.
 *
 * We could also require the generators to know imports before hand, but that means for,
 * for example, generating types that we need to do 2-passes, discarding writes and only
 * keeping the imports.
 *
 * @param {import("./context.js").GenerateFile} file
 */
export function fileImportsAddPlaceholder(
  file: import("./context.js").GenerateFile,
): void;
/**
 * Stringify the imports and replace the placeholder.
 *
 * @param {import("./context.js").GenerateFile} file
 */
export function fileImportsStringifyImports(
  file: import("./context.js").GenerateFile,
): void;
//# sourceMappingURL=imports.d.ts.map

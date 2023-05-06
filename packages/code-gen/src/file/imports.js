import { fileWrite } from "./write.js";

const importsPlaceholder = "$$_IMPORTS_$$";

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
export function fileImportsAddPlaceholder(file) {
  if (file.importCollector) {
    fileWrite(file, importsPlaceholder);
  }
}

/**
 * Stringify the imports and replace the placeholder.
 *
 * @param {import("./context.js").GenerateFile} file
 */
export function fileImportsStringifyImports(file) {
  if (file.importCollector) {
    file.contents = file.contents.replace(
      importsPlaceholder,
      file.importCollector.toString(),
    );
  }
}

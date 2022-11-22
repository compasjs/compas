import { AppError, isNil } from "@compas/stdlib";

/**
 * Collect and format JS imports. We only support ES module style imports for now.
 */
export class JavascriptImportCollector {
  /**
   * Resolve and type the import collector for JS files.
   *
   * @param {import("../file/context").GenerateFile}file
   * @returns {JavascriptImportCollector}
   */
  static getImportCollector(file) {
    if (
      isNil(file.importCollector) ||
      !(file.importCollector instanceof JavascriptImportCollector)
    ) {
      throw AppError.serverError({
        message: `File is created without an import collector.`,
      });
    }

    return file.importCollector;
  }

  constructor() {
    /** @type {Map<string, Set<string>>} */
    this.destructuredImports = new Map();

    /** @type {Set<string>} */
    this.rawImports = new Set();
  }

  toString() {
    const result = [...this.rawImports];

    // Sort the destructure imports, so even without any post formatting it looks pretty
    // good.
    const destructureKeys = [...this.destructuredImports.keys()].sort();

    for (const key of destructureKeys) {
      const symbols = [
        ...(this.destructuredImports.get(key)?.values() ?? []),
      ].sort();

      const isMultiline = symbols.length > 3;

      if (isMultiline) {
        result.push(`import {\n  ${symbols.join(",\n  ")}\n} from "${key}";`);
      } else {
        result.push(`import { ${symbols.join(",")} } from "${key}";`);
      }
    }

    return result.join("\n");
  }
}

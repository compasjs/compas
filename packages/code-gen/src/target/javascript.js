import { AppError, isNil } from "@compas/stdlib";

/**
 * Collect and format JS imports. We only support ES module style imports for now.
 */
export class JavascriptImportCollector {
  /**
   * Resolve and type the import collector for JS files.
   *
   * @param {import("../file/context.js").GenerateFile}file
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
    /**
     * @private
     * @type {Map<string, Set<string>>}
     */
    this.destructuredImports = new Map();

    /**
     * @private
     * @type {Set<string>}
     */
    this.rawImports = new Set();
  }

  /**
   * Use a destructure import
   *
   * @param {string} path
   * @param {string} symbol
   */
  destructure(path, symbol) {
    if (!this.destructuredImports.has(path)) {
      this.destructuredImports.set(path, new Set());
    }

    this.destructuredImports.get(path)?.add(symbol);
  }

  /**
   * Add a raw import. These are deduplicated, before writing.
   *
   * @param {string} importString
   */
  raw(importString) {
    this.rawImports.add(importString);
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

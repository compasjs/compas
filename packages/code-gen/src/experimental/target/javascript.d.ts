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
  static getImportCollector(
    file: import("../file/context").GenerateFile,
  ): JavascriptImportCollector;
  /**
   * @private
   * @type {Map<string, Set<string>>}
   */
  private destructuredImports;
  /**
   * @private
   * @type {Set<string>}
   */
  private rawImports;
  /**
   * Use a destructure import
   *
   * @param {string} path
   * @param {string} symbol
   */
  destructure(path: string, symbol: string): void;
  /**
   * Add a raw import. These are deduplicated, before writing.
   *
   * @param {string} importString
   */
  raw(importString: string): void;
  toString(): string;
}
//# sourceMappingURL=javascript.d.ts.map

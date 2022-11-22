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
  /** @type {Map<string, Set<string>>} */
  destructuredImports: Map<string, Set<string>>;
  /** @type {Set<string>} */
  rawImports: Set<string>;
  toString(): string;
}
//# sourceMappingURL=javascript.d.ts.map

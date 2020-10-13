import { dirnameForModule, pathJoin } from "../../../../stdlib/index.js";
import { compileTemplateDirectory, executeTemplate } from "../../template.js";

/**
 * @param {CodeGenContext} context
 */
export function generateApiClientFiles(context) {
  compileTemplateDirectory(
    pathJoin(dirnameForModule(import.meta), "templates"),
    ".tmpl",
  );

  const contents = executeTemplate("apiClientFile", {
    extension: context.extension,
    importExtension: context.importExtension,
    structure: context.structure,
    options: context.options,
  });

  context.outputFiles.push({
    contents: contents,
    relativePath: `./apiClient${context.extension}`,
  });
  context.rootExports.push(
    `export * from "./apiClient${context.importExtension}";`,
  );
}

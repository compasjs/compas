import { dirnameForModule, pathJoin } from "../../../../stdlib/index.js";
import { compileTemplateDirectory, executeTemplate } from "../../template.js";

/**
 * @param {CodeGenContext} context
 */
export function generateReactQueryFiles(context) {
  compileTemplateDirectory(
    pathJoin(dirnameForModule(import.meta), "templates"),
    ".tmpl",
  );

  const contents = executeTemplate("reactQueryFile", {
    extension: context.extension,
    importExtension: context.importExtension,
    structure: context.structure,
    options: context.options,
  });

  context.outputFiles.push({
    contents: contents,
    relativePath: `./reactQueries${context.extension}x`,
  });
  context.rootExports.push(
    `export * from "./reactQueries${
      context.importExtension === "" ? "" : `${context.importExtension}x`
    }";`,
  );
}

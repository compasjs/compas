import { dirnameForModule, isNil, pathJoin } from "@compas/stdlib";
import { compileTemplateDirectory, executeTemplate } from "../../template.js";

/**
 * @param {CodeGenContext} context
 */
export function generateReactQueryFiles(context) {
  compileTemplateDirectory(
    pathJoin(dirnameForModule(import.meta), "templates"),
    ".tmpl",
  );

  for (const group of Object.keys(context.structure)) {
    const groupStructure = context.structure[group];
    const hasRouteType = Object.values(groupStructure).find(
      (it) => it.type === "route",
    );

    if (isNil(hasRouteType)) {
      continue;
    }

    const contents = executeTemplate("reactQueryFile", {
      extension: context.extension,
      importExtension: context.importExtension,
      groupStructure,
      options: context.options,
    });

    context.outputFiles.push({
      contents: contents,
      relativePath: `./${group}/reactQueries${context.extension}x`,
    });
  }
}

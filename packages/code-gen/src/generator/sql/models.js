import { js } from "../tag/tag.js";
import { importCreator } from "../utils.js";
import { generateBaseQueries } from "./query-basics.js";
import { generateQueryBuilder } from "./query-builder.js";
import { generateQueryPartials } from "./query-partials.js";
import { getQueryEnabledObjects } from "./utils.js";

/**
 * Generate model files with query basic, partials and builder
 * @param {CodeGenContext} context
 */
export function generateModelFiles(context) {
  const allBasicNames = [];
  const indexSrc = [];

  for (const type of getQueryEnabledObjects(context)) {
    const src = [];
    const imports = importCreator();

    generateQueryPartials(context, imports, type, src);
    const baseQueryNames = generateBaseQueries(context, imports, type, src);
    generateQueryBuilder(context, imports, type, src);

    allBasicNames.push(...baseQueryNames);

    context.outputFiles.push({
      contents: js`
          ${imports.print()}
          ${src}
       `,
      relativePath: `./database/${type.name}.js`,
    });

    indexSrc.push(`import { ${baseQueryNames} } from "./${type.name}.js";`);
    context.rootExports.push(`export * from "./database/${type.name}.js";`);
  }

  indexSrc.push(`export const queries = { ${allBasicNames.join(", ")} };`);
  context.outputFiles.push({
    contents: indexSrc.join("\n"),
    relativePath: "./database/index.js",
  });

  context.rootExports.push(`export { queries } from "./database/index.js";`);
}

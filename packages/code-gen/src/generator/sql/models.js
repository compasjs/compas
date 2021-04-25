import { js } from "../tag/tag.js";
import { importCreator } from "../utils.js";
import { generateBaseQueries } from "./query-basics.js";
import { generateQueryBuilder } from "./query-builder.js";
import { generateQueryPartials } from "./query-partials.js";
import { getQueryEnabledObjects } from "./utils.js";

/**
 * Generate model files with query basic, partials and builder
 *
 * @param {CodeGenContext} context
 */
export function generateModelFiles(context) {
  const queryObjectNames = [];
  const indexSrc = [];

  for (const type of getQueryEnabledObjects(context)) {
    const src = [];
    const imports = importCreator();

    generateQueryPartials(context, imports, type, src);
    generateBaseQueries(context, imports, type, src);
    generateQueryBuilder(context, imports, type, src);

    queryObjectNames.push(`...${type.name}Queries`);

    context.outputFiles.push({
      contents: js`
          ${imports.print()}
          ${src}
       `,
      relativePath: `./database/${type.name}.js`,
    });

    indexSrc.push(`import { ${type.name}Queries } from "./${type.name}.js";`);
  }

  indexSrc.push(`export const queries = { ${queryObjectNames.join(", ")} };`);
  context.outputFiles.push({
    contents: indexSrc.join("\n"),
    relativePath: "./database/index.js",
  });
}

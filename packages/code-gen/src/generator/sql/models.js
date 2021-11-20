import { js } from "../tag/tag.js";
import { importCreator } from "../utils.js";
import { generateBaseQueries } from "./query-basics.js";
import { generateQueryBuilder } from "./query-builder.js";
import { generateQueryPartials } from "./query-partials.js";
import { getQueryEnabledObjects } from "./utils.js";

/**
 * Generate model files with query basic, partials and builder
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function generateModelFiles(context) {
  const queryObjectNames = [];
  const indexImports = importCreator();

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

    indexImports.destructureImport(`${type.name}Queries`, `./${type.name}.js`);
  }

  context.outputFiles.push({
    contents: js`
      ${indexImports.print()}

      export const queries = { ${queryObjectNames.sort().join(", ")} };
    `,
    relativePath: "./database/index.js",
  });
}

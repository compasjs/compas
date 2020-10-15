import { js } from "../tag/index.js";
import { getQueryEnabledObjects } from "./utils.js";
import { getWherePartial } from "./where-type.js";

/**
 * Generate all usefull query partials
 *
 * @param {CodeGenContext} context
 */
export function generateQueryPartials(context) {
  const partials = [];

  for (const type of getQueryEnabledObjects(context)) {
    partials.push(getWherePartial(context, type));
  }

  const file = js`
    import { query } from "./query-builder${context.importExtension}";

    ${partials}
  `;

  context.outputFiles.push({
    contents: file,
    relativePath: `./query-partials${context.extension}`,
  });
  context.rootExports.push(
    `export * from "./query-partials${context.importExtension}";`,
  );
}

import { js } from "./tag/index.js";

/**
 * If `options.dumpStructure` is on, create a structure.js file with the structure payload
 *
 * @param {CodeGenContext} context
 */
export function generateStructureFiles(context) {
  if (!context.options.dumpStructure) {
    return;
  }
  for (const group of Object.keys(context.structure)) {
    // Make it safe to inject in contents
    const string = JSON.stringify(context.structure[group])
      .replace(/\\/g, "\\\\")
      .replace("'", "\\'");

    context.outputFiles.push({
      contents: js`
                                 export const ${group}StructureString = '${string}';
                                 export const ${group}Structure = JSON.parse(
                                   ${group}StructureString);
                               `,
      relativePath: `./${group}/structure${context.extension}`,
    });
  }

  const imports = Object.keys(context.structure)
    .map(
      (it) =>
        js`import { ${it}Structure } from "./${it}/structure${context.importExtension}";`,
    )
    .join("\n");
  const groups = Object.keys(context.structure)
    .map((it) => `{ ${it}: ${it}Structure }`)
    .join(", ");

  context.outputFiles.push({
    contents: js`
                               ${imports}

                               export const structure = Object.assign({}, ${groups});
                               export const structureString = JSON.stringify(structure);
                             `,
    relativePath: `./structure${context.extension}`,
  });
}

/**
 * @param {CodeGenContext} context
 */
export function addRootExportsForStructureFiles(context) {
  if (!context.options.dumpStructure) {
    return;
  }

  for (const group of Object.keys(context.structure)) {
    context.rootExports.push(
      `export { ${group}Structure } from "./${group}/structure${context.importExtension}";`,
    );
  }

  context.rootExports.push(
    `export { structure, structureString } from "./structure${context.importExtension}";`,
  );
}

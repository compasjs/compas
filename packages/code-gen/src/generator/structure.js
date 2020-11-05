import { js } from "./tag/index.js";

/**
 * If `options.dumpStructure` is on, create a structure.js file with the structure payload
 *
 * @param {CodeGenContext} context
 */
export function generateStructureFile(context) {
  if (!context.options.dumpStructure) {
    return;
  }

  let structureSource = "";

  for (const group of Object.keys(context.structure)) {
    // Make it safe to inject in contents
    const string = JSON.stringify(context.structure[group])
      .replace(/\\/g, "\\\\")
      .replace(/[^\\]'/g, "\\'");

    structureSource += js`
      export const ${group}StructureString = '${string}';
      export const ${group}Structure = JSON.parse(${group}StructureString);
    `;
  }

  const groups = Object.keys(context.structure)
    .map((it) => `{ ${it}: ${it}Structure }`)
    .join(", ");

  context.outputFiles.push({
    contents: js`
                               ${structureSource}
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

  let sourceString = `
    export {
      structure,
      structureString,
  `;

  for (const group of Object.keys(context.structure)) {
    sourceString += `${group}Structure,\n`;
  }

  context.rootExports.push(
    `${sourceString}} from "./structure${context.importExtension}";`,
  );
}

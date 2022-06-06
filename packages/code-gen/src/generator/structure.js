import { includeReferenceTypes } from "../generate.js";
import { structureAddType } from "../structure/structureAddType.js";
import { structureIteratorNamedTypes } from "../structure/structureIterators.js";
import { js } from "./tag/index.js";

/**
 * Create a structure file with at least the generate options that are used.
 * If 'dumpStructure' is true, dump the structure before any generator added types or
 * something.
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function structureCreateFile(context) {
  let structureSource = "";

  structureSource = `export const compasGenerateSettings = ${JSON.stringify(
    context.options,
  )};`;

  if (context.options.dumpStructure) {
    for (const group of Object.keys(context.structure)) {
      // Make it safe to inject in contents
      const string = JSON.stringify(context.structure[group]).replace(
        /(['\\])/gm,
        (v) => `\\${v}`,
      );

      structureSource += js`
        export const ${group}StructureString = '${string}';
        export const ${group}Structure = JSON.parse(${group}StructureString);
      `;
    }

    const groups = Object.keys(context.structure)
      .map((it) => `{ ${it}: ${it}Structure }`)
      .join(", ");

    structureSource += js`
      export const structure = Object.assign({}, ${groups});
      export const structureString = JSON.stringify(structure);
    `;
  }

  context.outputFiles.push({
    contents: js`${structureSource}`,
    relativePath: `./common/structure${context.extension}`,
  });
}

/**
 * Append the final api structure to the 'structure' source if 'dumpApiStructure' is
 * true.
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function structureAppendApiStructure(context) {
  let structureSource = "";

  if (context.options.dumpApiStructure) {
    /** @type {import("../generated/common/types").CodeGenStructure} */
    const apiStructure = {};
    // Create a new structure object with all routes
    for (const type of structureIteratorNamedTypes(context.structure)) {
      if (type.type !== "route") {
        continue;
      }

      structureAddType(apiStructure, type);
    }

    // Include recursive references that are used in route types
    includeReferenceTypes(context.structure, apiStructure);

    const string = JSON.stringify(apiStructure).replace(
      /(['\\])/gm,
      (v) => `\\${v}`,
    );

    // We only need a string here at all times, which saves us on some doing a
    // stringify when sending the structure response.
    structureSource += js`
      export const compasApiStructureString = '${string}';
    `;
  }

  const file = context.outputFiles.find(
    (it) => it.relativePath === `./common/structure${context.extension}`,
  );

  if (file) {
    file.contents += structureSource;
  } else {
    context.outputFiles.push({
      contents: js`${structureSource}`,
      relativePath: `./common/structure${context.extension}`,
    });
  }
}

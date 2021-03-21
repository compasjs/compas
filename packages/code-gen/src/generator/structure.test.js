import { mainTestFn, test } from "@compas/cli";
import { generateStructureFile } from "./structure.js";

mainTestFn(import.meta);

test("code-gen/generator/structure", (t) => {
  t.test("generateStructureFile - dumpStructure: false", (t) => {
    const context = {
      options: {
        dumpStructure: false,
      },
      outputFiles: [],
      structure: {
        group: {},
        another: {},
      },
    };

    generateStructureFile(context);

    t.equal(context.outputFiles.length, 0);
  });

  t.test("generateStructureFile - dumpStructure: true", (t) => {
    const context = {
      options: {
        dumpStructure: true,
      },
      outputFiles: [],
      extension: ".js",
      structure: {
        group: {},
        another: {},
      },
    };

    generateStructureFile(context);

    t.equal(context.outputFiles.length, 1);
    t.equal(context.outputFiles[0].relativePath, "./structure.js");
  });

  t.test("generateStructureFile - extension: ts", (t) => {
    const context = {
      options: {
        dumpStructure: true,
      },
      outputFiles: [],
      extension: ".ts",
      structure: {
        group: {},
        another: {},
      },
    };

    generateStructureFile(context);

    t.equal(context.outputFiles.length, 1);
    t.equal(context.outputFiles[0].relativePath, "./structure.ts");
  });

  t.test("generateStructureFile - zero groups", (t) => {
    const context = {
      options: {
        dumpStructure: true,
      },
      outputFiles: [],
      extension: ".js",
      structure: {},
    };

    generateStructureFile(context);

    t.equal(context.outputFiles.length, 1);
    t.equal(
      context.outputFiles[0].contents,
      `export const structure = Object.assign({}, );\nexport const structureString = JSON.stringify(structure);`,
    );
  });
});

import { mainTestFn, test } from "@lbu/cli";
import {
  addRootExportsForStructureFiles,
  generateStructureFiles,
} from "./structure.js";

mainTestFn(import.meta);

test("code-gen/generator/structure", (t) => {
  t.test("generateStructureFiles - dumpStructure: false", (t) => {
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

    generateStructureFiles(context);

    t.equal(context.outputFiles.length, 0);
  });

  t.test("generateStructureFiles - dumpStructure: true", (t) => {
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

    generateStructureFiles(context);

    t.equal(context.outputFiles.length, 3);
    t.equal(context.outputFiles[0].relativePath, "./group/structure.js");
    t.equal(context.outputFiles[1].relativePath, "./another/structure.js");
    t.equal(context.outputFiles[2].relativePath, "./structure.js");
  });

  t.test("generateStructureFiles - extension: ts", (t) => {
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

    generateStructureFiles(context);

    t.equal(context.outputFiles.length, 3);
    t.equal(context.outputFiles[0].relativePath, "./group/structure.ts");
    t.equal(context.outputFiles[1].relativePath, "./another/structure.ts");
    t.equal(context.outputFiles[2].relativePath, "./structure.ts");
  });

  t.test("generateStructureFiles - zero groups", (t) => {
    const context = {
      options: {
        dumpStructure: true,
      },
      outputFiles: [],
      extension: ".js",
      structure: {},
    };

    generateStructureFiles(context);

    t.equal(context.outputFiles.length, 1);
    t.equal(
      context.outputFiles[0].contents,
      `export const structure = Object.assign({}, );\nexport const structureString = JSON.stringify(structure);`,
    );
  });

  t.test("addRootExportsForStructureFiles - dumpStructure: false", (t) => {
    const context = {
      options: {
        dumpStructure: false,
      },
      rootExports: [],
      structure: {
        group: {},
        another: {},
      },
    };

    addRootExportsForStructureFiles(context);

    t.equal(context.rootExports.length, 0);
  });

  t.test("addRootExportsForStructureFiles - dumpStructure: true", (t) => {
    const context = {
      options: {
        dumpStructure: true,
      },
      rootExports: [],
      extension: ".js",
      importExtension: ".js",
      structure: {
        group: {},
        another: {},
      },
    };

    addRootExportsForStructureFiles(context);

    t.equal(context.rootExports.length, 3);
    t.equal(
      context.rootExports[0],
      `export { groupStructure } from "./group/structure.js";`,
    );
    t.equal(
      context.rootExports[1],
      `export { anotherStructure } from "./another/structure.js";`,
    );
    t.equal(
      context.rootExports[2],
      `export { structure, structureString } from "./structure.js";`,
    );
  });

  t.test("addRootExportsForStructureFiles - extension: ts", (t) => {
    const context = {
      options: {
        dumpStructure: true,
      },
      rootExports: [],
      extension: ".ts",
      importExtension: "",
      structure: {
        group: {},
        another: {},
      },
    };

    addRootExportsForStructureFiles(context);

    t.equal(context.rootExports.length, 3);
    t.equal(
      context.rootExports[0],
      `export { groupStructure } from "./group/structure";`,
    );
    t.equal(
      context.rootExports[1],
      `export { anotherStructure } from "./another/structure";`,
    );
    t.equal(
      context.rootExports[2],
      `export { structure, structureString } from "./structure";`,
    );
  });

  t.test("addRootExportsForStructureFiles - zero groups", (t) => {
    const context = {
      options: {
        dumpStructure: true,
      },
      rootExports: [],
      extension: ".js",
      importExtension: ".js",
      structure: {},
    };

    addRootExportsForStructureFiles(context);

    t.equal(context.rootExports.length, 1);

    t.equal(
      context.rootExports[0],
      `export { structure, structureString } from "./structure.js";`,
    );
  });
});

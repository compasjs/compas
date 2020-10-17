import { readFileSync } from "fs";
import { mainTestFn, test } from "@lbu/cli";
import { App } from "@lbu/code-gen";
import { isNil, processDirectoryRecursiveSync } from "@lbu/stdlib";
import {
  applyAllLocalGenerate,
  generateSettings,
} from "../../scripts/generate.js";

mainTestFn(import.meta);

// A simple check to see if our generated files are possible up to date.
// This doesn't catch small fixes, but will catch new entities, routes, and top level
// types.
test("repo/code-gen", async (t) => {
  const fileFilter = [
    "anonymous-validators.js",
    "query-basics.js",
    "query-partials.js",
    "query-traverser.js",
    "apiClient.js",
  ];

  const generatedFileMap = await getGeneratedFileMap(fileFilter);
  const existingFileMap = getExistingFileMap(fileFilter);

  if (
    Object.keys(existingFileMap).length !== Object.keys(generatedFileMap).length
  ) {
    t.fail(
      "A new generate call contains more/less files than the existing directory. Call 'yarn lbu gen' to fix this.",
    );
    return;
  }
  t.pass("Equal amount of generated files.");

  for (const key of Object.keys(existingFileMap)) {
    if (generatedFileMap[key] !== existingFileMap[key]) {
      t.fail(
        `File ./generated/testing${key} is outdated. Call 'yarn lbu gen' to fix this.`,
      );
    } else {
      t.pass(`Generated file ${key} is up to date.`);
    }
  }

  t.pass("Generated file contents are the same.");
});

/**
 * Quick hack to count the amount of exports in a file
 * @param {string} input
 * @returns {number}
 */
function getExportCountInFile(input) {
  return input.split("export ").length - 1;
}

/**
 * Gets new files with a generate call, and counts the exports for files that end with
 * the file filter.
 *
 * @param {string[]} fileFilter
 * @returns {Promise<Object<string, number>>}
 */
async function getGeneratedFileMap(fileFilter) {
  const app = await App.new({});
  applyAllLocalGenerate(app);
  const fileMap = {};

  for (const settings of Object.values(generateSettings)) {
    // Do the generate call
    const files = await app.generate({
      ...settings,
      returnFiles: true,
    });

    // The output directory is more nested than `generated/testing`
    const pathPrefix = settings.outputDirectory
      .split("/")
      .filter((it) => it.length > 0)
      .pop();

    for (const file of files) {
      const path = `/${pathPrefix}/${file.relativePath.substring(2)}`;

      // filter files
      let needThisFile = false;
      for (const testPath of fileFilter) {
        if (path.endsWith(testPath)) {
          needThisFile = true;
        }
      }
      if (!needThisFile) {
        continue;
      }

      fileMap[path] = getExportCountInFile(file.contents);
    }
  }

  return fileMap;
}

/**
 * Traverser the generated/testing output directory to read the necessary files and count
 * the number of exports.
 * @param {string[]} fileFilter
 * @returns {Object<string, number>}
 */
function getExistingFileMap(fileFilter) {
  const existingFiles = {};
  const filePrefix = "generated/testing";
  processDirectoryRecursiveSync("./generated/testing", (file) => {
    const relativePath = `${file.substring(filePrefix.length)}`;

    // If .ts already exists, ignore this file
    if (relativePath.endsWith(".js")) {
      if (
        !isNil(
          existingFiles[
            `${relativePath.substring(0, relativePath.length - 2)}ts`
          ],
        )
      ) {
        return;
      }
    } else if (relativePath.endsWith(".ts")) {
      // If a .js file exists, remove it
      const jsPath = `${relativePath.substring(0, relativePath.length - 2)}js`;
      if (!isNil(existingFiles[jsPath])) {
        delete existingFiles[jsPath];
      }
    }

    // Run the file filter
    let needThisFile = false;
    for (const testPath of fileFilter) {
      if (relativePath.endsWith(testPath)) {
        needThisFile = true;
      }
    }
    if (!needThisFile) {
      return;
    }

    const contents = readFileSync(file, "utf8");

    existingFiles[relativePath] = getExportCountInFile(contents);
  });

  return existingFiles;
}

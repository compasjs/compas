import { writeFile } from "fs/promises";
import { exec, pathJoin, uuid } from "@compas/stdlib";
import { temporaryDirectory } from "../../../src/testing.js";
import { App } from "../src/App.js";

/**
 * Try to generate with the provided builders in a temporary directory.
 * - First dump the structure
 * - Create a file that imports structure and tries to generate
 * - Execute file and capture stdout, stderr
 * - Return stdout, stderr, exitCode and the generated path.
 *
 * Since we use a sub directory on the 'temporaryDirectory', we don't have to clean up.
 *
 * @param {TypeBuilder[]} builders
 * @param {GenerateOpts} [opts]
 * @returns {Promise<{ stdout: string, exitCode: number }>}
 */
export async function generateAndRunForBuilders(builders, opts = {}) {
  const randomDir = uuid();
  const baseDirectory = pathJoin(process.cwd(), temporaryDirectory, randomDir);
  const structureDirectory = pathJoin(baseDirectory, "/structure");
  const generatedDirectory = pathJoin(baseDirectory, "/generated");

  const app = new App();
  app.add(...builders);

  // Disable all (inferred) generators
  await app.generate({
    ...opts,
    outputDirectory: structureDirectory,
    dumpStructure: true,
    enabledGenerators: [],
    isNodeServer: false,
    isNode: false,
    isBrowser: false,
  });

  const genFile = `
import { mainFn } from "@compas/stdlib";
import { App } from "@compas/code-gen";
import { structure } from "${structureDirectory}/common/structure.js";

mainFn(import.meta, main);

async function main() {
  const app = new App();
  
  app.extend(structure);
  
  await app.generate({
    ...JSON.parse('${JSON.stringify(opts)}'),
    outputDirectory: "${generatedDirectory}",
  });
}
  `;

  const generateFile = pathJoin(baseDirectory, `generate.js`);

  await writeFile(generateFile, genFile, "utf-8");
  const { exitCode, stdout, stderr } = await exec(`node ${generateFile}`);

  return {
    generatedDirectory,
    stdout,
    stderr,
    exitCode,
  };
}

import { mkdir, rm, writeFile } from "node:fs/promises";
import { exec, pathJoin, uuid } from "@compas/stdlib";
import { testTemporaryDirectory } from "../../../../src/testing.js";
import { App } from "../../src/App.js";

/**
 * Try to generate with the provided builders in a temporary directory.
 * - First dump the structure
 * - Create a file that imports structure and tries to generate
 * - Execute file and capture stdout, stderr
 * - Return stdout, stderr, exitCode and the generated path.
 *
 * Since we use a subdirectory on the 'temporaryDirectory', we don't have to clean up.
 *
 * @deprecated
 *
 * @param {{
 *   add?: Parameters<typeof App.prototype.add>,
 *   extend?: Parameters<typeof App.prototype.extend>[],
 *   extendWithOpenApi?: Parameters<typeof App.prototype.extendWithOpenApi>[],
 *
 * }|TypeBuilderLike[]} input
 * @param {GenerateOpts} [opts]
 * @returns {Promise<{
 *   stdout: string,
 *   stderr?: string,
 *   exitCode: number,
 *   generatedDirectory: string,
 *   cleanupGeneratedDirectory: () => Promise<void>,
 *  }>}
 */
export async function codeGenToTemporaryDirectory(input, opts = {}) {
  const baseDirectory = pathJoin(process.cwd(), testTemporaryDirectory, uuid());
  const structureDirectory = pathJoin(baseDirectory, "/structure");
  const generatedDirectory = pathJoin(baseDirectory, "/generated");

  await mkdir(baseDirectory, { recursive: true });
  await writeFile(
    pathJoin(baseDirectory, "package.json"),
    JSON.stringify(
      {
        type: "module",
        private: true,
      },
      null,
      2,
    ),
    "utf-8",
  );

  const app = new App();

  if (Array.isArray(input)) {
    app.add(...input);
  }

  if (Array.isArray(input?.add)) {
    app.add(...input.add);
  }

  if (Array.isArray(input?.extend)) {
    for (const ext of input.extend) {
      app.extend(...ext);
    }
  }

  if (Array.isArray(input?.extendWithOpenApi)) {
    for (const ext of input.extendWithOpenApi) {
      app.extendWithOpenApi(...ext);
    }
  }

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
import { structure } from "./structure/common/structure.js";

mainFn(import.meta, main);

async function main() {
  const app = new App();
  
  app.extend(structure);
  
  await app.generate({
    ...JSON.parse('${JSON.stringify(opts)}'),
    outputDirectory: "${generatedDirectory}",
  });
  process.exit(0);
}
  `;

  const generateFile = pathJoin(baseDirectory, `generate.js`);
  await writeFile(generateFile, genFile, "utf-8");

  const { exitCode, stdout, stderr } = await exec(`node ${generateFile}`);

  const cleanupGeneratedDirectory = async () => {
    await rm(baseDirectory, { recursive: true, force: true });
  };

  return {
    generatedDirectory,
    stdout,
    stderr,
    exitCode,
    cleanupGeneratedDirectory,
  };
}

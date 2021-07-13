import { spawn as cpSpawn } from "child_process";
import { rm, writeFile } from "fs/promises";
import { pathJoin, uuid } from "../../stdlib/index.js";
import { App } from "../src/App.js";

/**
 * Try to generate with the provided builders in a temporary directory.
 * - First dump the structure
 * - Create a file that imports structure and tries to generate
 * - Execute file via spawn to get the stdout
 * - Return stdout and exitCode
 *
 * @param {TypeBuilder[]} builders
 * @param {GenerateOpts} [opts]
 * @returns {Promise<{ stdout: string, exitCode: number }>}
 */
export async function generateAndRunForBuilders(builders, opts = {}) {
  const tmpDirectory = pathJoin(process.cwd(), `/__fixtures__/tmp/${uuid()}`);
  const tmpDirectoryStructure = pathJoin(tmpDirectory, "/structure");
  const tmpDirectoryGenerate = pathJoin(tmpDirectory, "/generated");

  const app = new App();
  app.add(...builders);

  // Disable all (inferred) generators
  await app.generate({
    ...opts,
    outputDirectory: tmpDirectoryStructure,
    dumpStructure: true,
    enabledGenerators: [],
    isNodeServer: false,
    isNode: false,
    isBrowser: false,
  });

  const genFile = `
import { mainFn } from "@compas/stdlib";
import { App } from "@compas/code-gen";
import { structure } from "${tmpDirectoryStructure}/common/structure.js";

mainFn(import.meta, main);

async function main() {
  const app = new App();
  
  app.extend(structure);
  
  await app.generate({
    ...JSON.parse('${JSON.stringify(opts)}'),
    outputDirectory: "${tmpDirectoryGenerate}",
  });
}
  `;

  const testFilePath = pathJoin(tmpDirectory, `${uuid().substr(0, 6)}.js`);

  await writeFile(testFilePath, genFile, "utf-8");

  const sp = cpSpawn(`node`, [testFilePath], { stdio: "pipe" });

  const stdoutBuffers = [];
  sp.stdout.on("data", (data) => {
    stdoutBuffers.push(data);
  });

  const exitCode = await new Promise((r) => {
    sp.once("exit", (e) => r(e ?? 0));
  });

  await rm(tmpDirectory, { recursive: true, force: true });

  return {
    stdout: Buffer.concat(stdoutBuffers).toString("utf-8"),
    exitCode,
  };
}

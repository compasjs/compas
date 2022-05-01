import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { readdir } from "node:fs/promises";
import { dirnameForModule, mainFn, pathJoin, spawn } from "@compas/stdlib";
import { syncCliReference } from "../src/cli-reference.js";

mainFn(import.meta, main);

/**
 * Copy various things around README's and docs
 *
 * @param {Logger} logger
 */
async function main(logger) {
  if (pathJoin(process.cwd(), "scripts") !== dirnameForModule(import.meta)) {
    throw new Error("Wrong directory. Run in root.");
  }

  syncReadmes(logger);
  syncDocs(logger);
  await syncDocExamples(logger);

  await syncCliReference(logger);

  logger.info("Regenerating");
  await spawn("compas", ["generate"], {
    env: {
      ...process.env,
      CI: "false",
    },
  });

  logger.info("Done");
}

/**
 * Sync repo files to docs root
 *
 * @param {Logger} logger
 */
function syncDocs(logger) {
  const rootDir = process.cwd();
  const docsDir = pathJoin(rootDir, "docs");

  const files = ["changelog.md", "contributing.md"];

  for (const file of files) {
    const path = pathJoin(rootDir, file);

    if (!existsSync(path)) {
      logger.error(`Could not find '${file}' at '${path}'.`);
      process.exit(1);
    }

    writeFileSync(pathJoin(docsDir, file), readFileSync(path));
  }
}

/**
 * Sync root and package readme's
 *
 * @param {Logger} logger
 */
function syncReadmes(logger) {
  const packagesDir = pathJoin(process.cwd(), "packages");
  const packages = readdirSync(packagesDir);
  const readmeSource = getReadmeSource();
  const licenseSource = readFileSync(
    pathJoin(process.cwd(), "LICENSE"),
    "utf-8",
  );

  logger.info(`Updating ${packages.length} README.md's`);

  for (const pkg of packages) {
    const pkgDir = pathJoin(packagesDir, pkg);

    writeFileSync(
      pathJoin(pkgDir, "README.md"),
      buildReadmeSource(pkg, readmeSource),
      "utf-8",
    );

    writeFileSync(pathJoin(pkgDir, "LICENSE"), licenseSource, "utf-8");
  }
}

/**
 * @param {string} pkgName
 * @param {string} readmeSource
 */
function buildReadmeSource(pkgName, readmeSource) {
  return `# @compas/${pkgName}\n[![install size ${pkgName}](https://packagephobia.com/badge?p=@compas/${pkgName})](https://packagephobia.com/result?p=@compas/${pkgName})${readmeSource}\n`;
}

function getReadmeSource() {
  const src = readFileSync(pathJoin(process.cwd(), "README.md"), "utf-8");

  return src.split("\n").slice(1).join("\n");
}

async function syncDocExamples() {
  let source = `# Compas examples

Examples of how to do various tasks with Compas. The sources are contained as
much as possible. However, the tests may need some changes to work outside the
Compas monorepo. If that is the case, there will be a note in the appropriate
test files.
`;

  const tags = {
    "Code gen": [],
    Server: [],
    Other: [],
  };

  for (const exampleName of await readdir("./examples", {
    encoding: "utf-8",
  })) {
    if (exampleName.includes(".")) {
      continue;
    }

    const { exampleMetadata } = JSON.parse(
      await readFile(`./examples/${exampleName}/package.json`, "utf-8"),
    );

    for (const tag of exampleMetadata?.tags ?? ["Other"]) {
      tags[tag].push(exampleName);
    }
  }

  for (const tag of Object.keys(tags)) {
    if (tags[tag].length === 0) {
      continue;
    }

    source += `\n\n## ${tag}`;

    for (const name of tags[tag]) {
      source += `\n- [${name}](https://github.com/compasjs/compas/tree/main/examples/${name})`;
    }
  }

  await writeFile(`./docs/examples.md`, source);
}

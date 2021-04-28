import { readFileSync } from "fs";
import {
  dirnameForModule,
  isNil,
  pathJoin,
  processDirectoryRecursiveSync,
} from "@compas/stdlib";

/**
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @param {ScriptCollection} scriptCollection
 * @returns {void}
 */
export function helpCommand(logger, command, scriptCollection) {
  const { name, version } = JSON.parse(
    readFileSync(
      pathJoin(dirnameForModule(import.meta), "../../package.json"),
      "utf-8",
    ),
  );

  const foundCompasVersions = findOtherCompasStdlibVersions(version);

  let log = `${name} -- ${version}
${formatOtherVersions(foundCompasVersions)}
Usage:

- init              : compas init [projectName]
- help              : compas help
- docker            : compas docker [up,down,clean,reset]
- proxy             : compas proxy [--verbose]
- run (explicit)    : compas run [--watch] [--verbose] [--any-node-arg] {scriptName|path/to/file.js} [--script-arg]
- run (implicit)    : compas [--watch] [--verbose] [--any-node-arg] {scriptName|path/to/file.js} [--script-arg]
- test              : compas test [--watch] [--verbose] [--node-arg]
- bench             : compas bench [--watch] [--verbose] [--node-arg]
- coverage          : compas coverage [--watch] [--verbose] [--any-node-arg] [-- --c8-arg]
- lint              : compas lint [--watch] [--verbose] [--any-node-arg]
- visualise         : compas visualise [sql,router] {path/to/generated/index.js} [--format png|svg|webp|pdf] [--output ./path/to/output.ext]


Available script names:
${formatScripts(scriptCollection)}

Custom scripts may control watch behaviour by exporting a constant called 'cliWatchOptions'
with type CliWatchOptions from the script.
`;

  if (command.error) {
    log += `\n\nError: ${command.error}`;
  }

  logger.info(log);
}

/**
 * @param {ScriptCollection} coll
 */
function formatScripts(coll) {
  const user = [];
  const packageJson = [];

  for (const v of Object.values(coll)) {
    if (v.type === "user") {
      user.push(v.name);
    } else if (v.type === "package") {
      packageJson.push(v.name);
    }
  }

  return `User: ${user.join(", ")}\nPackage.json: ${packageJson.join(", ")}`;
}

/**
 * @param {{ version: string, path: string }[]} versions
 * @returns {string}
 */
function formatOtherVersions(versions) {
  if (versions.length === 0) {
    return "";
  }

  let result = `\nMultiple @compas versions found, to ensure a stable experience use the version that is commonly accepted by all your dependencies.\n`;
  for (const { path, version } of versions) {
    result += `@compas/stdlib@${version} - ${path}\n`;
  }

  return result;
}

/**
 * Try to find other compas versions, by recursively going through the node_modules
 *
 * @param {string} cliVersion
 * @returns {{ version: string, path: string }[]}
 */
function findOtherCompasStdlibVersions(cliVersion) {
  const foundVersions = [];

  processDirectoryRecursiveSync(
    pathJoin(process.cwd()),
    (file) => {
      if (file.endsWith("/@compas/stdlib/package.json")) {
        const { version } = JSON.parse(readFileSync(file, "utf-8"));

        if (
          cliVersion !== version &&
          isNil(foundVersions.find((it) => it.version === version))
        ) {
          foundVersions.push({
            path: file,
            version,
          });
        }
      }
    },
    {
      skipNodeModules: false,
    },
  );

  return foundVersions;
}

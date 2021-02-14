import { readFileSync } from "fs";
import { dirnameForModule, pathJoin } from "@compas/stdlib";

/**
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @param {ScriptCollection} scriptCollection
 * @returns {undefined}
 */
export function helpCommand(logger, command, scriptCollection) {
  const { name, version } = JSON.parse(
    readFileSync(
      pathJoin(dirnameForModule(import.meta), "../../package.json"),
      "utf-8",
    ),
  );

  let log = `${name} -- ${version}

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

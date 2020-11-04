import { readFileSync } from "fs";
import { dirnameForModule, pathJoin } from "@lbu/stdlib";

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

  let log = `${name} -- ${version}

Usage:

- init              : lbu init [projectName]
- help              : lbu help
- docker            : lbu docker [up,down,clean,reset]
- proxy             : lbu proxy
- run (explicit)    : lbu run [--watch] [--verbose] [--any-node-arg] {scriptName|path/to/file.js} [--script-arg]
- run (implicit)    : lbu [--watch] [--verbose] [--any-node-arg] {scriptName|path/to/file.js} [--script-arg]
- test              : lbu test [--watch] [--verbose] [--node-arg]
- bench             : lbu bench [--watch] [--verbose] [--node-arg]
- coverage          : lbu coverage [--watch] [--verbose] [--any-node-arg] [-- --c8-arg]
- lint              : lbu lint [--watch] [--verbose] [--any-node-arg]
- visualise         : lbu visualise [sql,router] {path/to/generated/index.js}


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

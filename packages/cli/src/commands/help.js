import { dirnameForModule } from "@lbu/stdlib";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @param {ScriptCollection} scriptCollection
 * @return {void}
 */

export function helpCommand(logger, command, scriptCollection) {
  const { name, version } = JSON.parse(
    readFileSync(
      join(dirnameForModule(import.meta), "../../package.json"),
      "utf-8",
    ),
  );

  let log = `${name} -- ${version}

Usage:

- init              : lbu init [projectName]
- help              : lbu help
- docker            : lbu docker [up,down]
- run (explicit)    : lbu run [--watch] [--verbose] [--any-node-arg] {scriptName|path/to/file.js} [--script-arg]
- run (implicit)    : lbu [--watch] [--verbose] [--any-node-arg] {scriptName|path/to/file.js} [--script-arg]
- test              : lbu test [--watch] [--verbose] [--script-arg]
- lint              : lbu lint [--watch] [--verbose] [--script-arg]
- profile           : lbu profile [--verbose] [--any-node-arg] {scriptName|path/to/file.js} [--script-arg]

Available script names:
${formatScripts(scriptCollection)}

Custom scripts may control watch behaviour with the following exports:

export const allowNodemon = false;
  Overrides --watch flag and set to false
export const nodemonArgs = "--ignore my/dir";
  If set, will be passed to nodemon. This prevents getting in a restart loop by controlling watched directories better
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

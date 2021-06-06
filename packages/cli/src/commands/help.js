import { existsSync, readFileSync } from "fs";
import {
  dirnameForModule,
  exec,
  isNil,
  pathJoin,
  processDirectoryRecursiveSync,
} from "@compas/stdlib";

/**
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @param {ScriptCollection} scriptCollection
 * @returns {Promise<void>}
 */
export async function helpCommand(logger, command, scriptCollection) {
  const { name, version } = JSON.parse(
    readFileSync(
      pathJoin(dirnameForModule(import.meta), "../../package.json"),
      "utf-8",
    ),
  );

  if (command.arguments.includes("--version")) {
    // Needs no-console so the output can be used in other commands
    // eslint-disable-next-line no-console
    console.log(`v${version}`);

    return;
  }

  let log = `${name} -- ${version}
Usage:

- init              : compas init [projectName]
- help              : compas help [--check] [--version]
- docker            : compas docker [up,down,clean,reset]
- docker            : compas docker migrate [rebuild,info] [--keep-alive|--keep-alive-without-lock] [--connection-settings ./sql/connection/settings.js]
- proxy             : compas proxy [--verbose]
- run (explicit)    : compas run [--watch] [--verbose] [--any-node-arg] {scriptName|path/to/file.js} [--script-arg]
- run (implicit)    : compas [--watch] [--verbose] [--any-node-arg] {scriptName|path/to/file.js} [--script-arg]
- test              : compas test [--watch] [--verbose] [--node-arg]
- bench             : compas bench [--watch] [--verbose] [--node-arg]
- coverage          : compas coverage [--watch] [--verbose] [--any-node-arg] [-- --c8-arg]
- lint              : compas lint [--watch] [--verbose] [--any-node-arg]
- code-mod          : compas code-mod [--verbose] [list,exec] [code-mod-name]
- visualise         : compas visualise [sql,router] {path/to/generated/index.js} [--format png|svg|webp|pdf] [--output ./path/to/output.ext]


Available script names:
${formatScripts(scriptCollection)}

Custom scripts may control watch behaviour by exporting a constant called 'cliWatchOptions'
with type CliWatchOptions from the script.

The SQL settings exported for the '--connection-settings' should be a constant called 'postgresConnectionSettings' and be accepted by 'newPostgresConnection'.
`;

  if (command.error) {
    log += `\n\nError: ${command.error}`;
  }

  if (command.arguments[0] === "--check") {
    const foundCompasVersions = findOtherCompasStdlibVersions(version);
    const envLocalIgnored = await isEnvLocalIgnored();

    if (foundCompasVersions.length === 0 && envLocalIgnored) {
      log += `\n\nNotices: everything is setup correctly.`;
    } else {
      log += `\n\nNotices:\n`;

      if (foundCompasVersions.length > 0) {
        log += formatOtherVersions(foundCompasVersions);
      }
      if (!envLocalIgnored) {
        log += `\n- File '.env.local' is not ignored. Please add it to your '.gitignore'.`;
      }
    }
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

  let result = `\n- Multiple @compas versions found, to ensure a stable experience use the version that is commonly accepted by all your dependencies.\n`;
  for (const { path, version } of versions) {
    result += `  - @compas/stdlib@${version} - ${path}\n`;
  }

  return result;
}

/**
 * If .env.local exists and a git repo exists, expect .env.local to be git ignored
 *
 * @returns {Promise<boolean>}
 */
async function isEnvLocalIgnored() {
  if (!existsSync("./.env.local")) {
    return true;
  }

  const { exitCode } = await exec("git check-ignore -q .env.local");

  // 128 if no git repo exists in directory
  return exitCode === 0 || exitCode === 128;
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

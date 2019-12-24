import { runCodeGen } from "../code-gen";
import { Logger } from "../insight";
import { load as lightbaseLoader } from "../loader";
import { isNil, spawn } from "../stdlib";
import { existsSync } from "fs";
import { join } from "path";
import { copyTemplate } from "./boilerplate";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../../package");

const commandMap: Record<
  string,
  (logger: Logger, args: string[]) => Promise<void>
> = {
  help: printHelp,
  init: initCommand,
  version: versionCommand,
  lint: lintCommand,
  generate: generateCommand,
};

export function runCommand(logger: Logger, args: string[]) {
  const [main, ...additionalArgs] = args;

  const commandToExec = commandMap[main] || commandMap["help"];
  commandToExec(logger, additionalArgs).catch(err => logger.error(err));
}

export async function printHelp(logger: Logger, args: string[]) {
  let logInfo = `Lightbase backend framework -- ${version}\n\n`;

  logInfo += "Subcommands:\n\n";
  logInfo += Object.keys(commandMap).join(", ");
  logInfo += "\n\nUsage:\n\n";
  logInfo += "lbf subcommand [...args]\n\n";

  if (args[0] !== "help" && !isNil(commandMap[args[0]])) {
    logInfo += `${args[0]} -- `;

    switch (args[0]) {
      case "version":
        logInfo +=
          "Print the version of this framework and from the Node.js instance that is used.";
        break;
      case "init":
        logInfo += "Initialize a new project that is using @lightbase/lbf";
        break;
      case "lint":
        logInfo += "Run eslint & prettier in the current directory";
        break;
      case "generate":
        logInfo +=
          "Generate code from config#codegen#input and write to config#codegen#output.\nWill also lint the current project";
        break;
    }
  }

  logger.info(logInfo);
}

/**
 * Initialize a new project by copying the template
 */
export async function initCommand(logger: Logger, args: string[]) {
  const sourceDir = join(__dirname, "..", "template");
  const targetDir = !isNil(args[0])
    ? join(process.cwd(), args[0])
    : process.cwd();

  await copyTemplate(logger, sourceDir, targetDir);
}

/**
 * Print Node & @lightbase/lbf versions
 * Note: When we don't use synchronized versioning this may need to be improved
 */
export async function versionCommand(logger: Logger) {
  logger.info("@lightbase/lbf version", {
    "@lightbase/lbf": version,
    node: process.version,
  });
}

/**
 * Run eslint & prettier
 */
export async function lintCommand(logger: Logger) {
  if (!existsSync("./node_modules")) {
    logger.error(
      "Make sure to run this command in the root directory and to install all packages.",
    );
    return;
  }

  await spawn(logger, "./node_modules/.bin/eslint", [
    "./**/*.ts",
    "--ignore-pattern",
    "*.d.ts",
    "--ignore-pattern",
    "*/dist/*",
    "--fix",
  ]);

  await spawn(logger, "./node_modules/.bin/prettier", [
    "-l",
    "./**/**.{js,ts,json}",
    "--write",
  ]);
}

/**
 * Uses @lightbase/loader
 * Runs the code-gen & runs the lint command
 */
export async function generateCommand(logger: Logger) {
  // Needs to load config, let @lightbase/loader handle that
  lightbaseLoader();

  runCodeGen(logger);
  await lintCommand(logger);
}

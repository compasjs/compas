import { Logger } from "../insight";
import { isNil } from "../stdlib";
import { dockerCommand } from "./docker";
import { generateCommand } from "./generate";
import { lintCommand } from "./lint";
import { initCommand } from "./template";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../../package");

interface CommandFn {
  (logger: Logger, args: string[]): Promise<void>;

  help?: string;
}

const commandMap: Record<string, CommandFn> = {
  help: printHelp,
  init: initCommand,
  version: versionCommand,
  lint: lintCommand,
  generate: generateCommand,
  docker: dockerCommand,
};

export function runCommand(logger: Logger, args: string[]) {
  const [main, ...additionalArgs] = args;

  const commandToExec = commandMap[main] || commandMap["help"];
  commandToExec(logger, additionalArgs).catch(err => logger.error(err));
}

export async function printHelp(logger: Logger, [command]: string[]) {
  let logInfo = `Lightbase backend framework -- ${version}\n\n`;

  logInfo += "Subcommands:\n\n";
  logInfo += Object.keys(commandMap).join(", ");
  logInfo += "\n\nUsage:\n\n";
  logInfo += "lbf subcommand [...args]\n\n";

  if (
    command !== "help" &&
    !isNil(commandMap[command]) &&
    !isNil(commandMap[command].help)
  ) {
    logInfo += commandMap[command].help;
  }

  logger.info(logInfo);
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

versionCommand.help =
  "lbf version -- Print the version of this framework and from the Node.js instance that is used.";

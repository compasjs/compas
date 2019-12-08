import { Logger } from "@lightbase/insight";
import { isNil } from "@lightbase/stdlib";
import { join } from "path";
import { copyTemplate } from "./boilerplate";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package");

const commandMap: Record<string, (logger: Logger, args: string[]) => void> = {
  help: printHelp,
  init: initCommand,
  version: versionCommand,
};

export function runCommand(args: string[], logger: Logger) {
  const [main, ...additionalArgs] = args;

  const commandToExec = commandMap[main] || commandMap["help"];
  commandToExec(logger, additionalArgs);
}

export function printHelp(logger: Logger, args: string[]) {
  let logInfo = `@lightbase/cli -- ${version} -- Lightbase backend framework\n\n`;

  logInfo += "Subcommands:\n\n";
  logInfo += Object.keys(commandMap).join(", ");
  logInfo += "\n\nUsage:\n\n";
  logInfo += "lightbase subcommand [...args]\n\n";

  if (args[0] !== "help" && !isNil(commandMap[args[0]])) {
    logInfo += `${args[0]} -- `;

    switch (args[0]) {
      case "version":
        logInfo +=
          "Print the version of this framework and from the Node.js instance that is used.";
        break;
      case "init":
        logInfo += "Initialize a new project that is using @lightbase/*";
    }
  }

  logger.info(logInfo);
}

export function initCommand(logger: Logger, args: string[]) {
  const sourceDir = join(__dirname, "..", "template");
  const targetDir = !isNil(args[0])
    ? join(process.cwd(), args[0])
    : process.cwd();
  copyTemplate(sourceDir, targetDir);
  logger.info("TODO: Dump boilerplate");
}

export function versionCommand(logger: Logger, args: string[]) {
  logger.info("@lightbase/cli version", {
    "@lightbase/cli": version,
    node: process.version,
  });
}

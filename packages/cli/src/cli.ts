import { Logger } from "@lbu/insight";
import { join } from "path";
import { generateCommand } from "./generate";
import { pgCommand } from "./pg";
import { initCommand } from "./template";
import { CliContext, Command, Config } from "./types";
import { execCommand, getLbuVersion } from "./utils";

const commandMap: Command = {
  help: helpCommand,
  init: initCommand,
  generate: generateCommand,
  pg: pgCommand,
};

export function run(logger: Logger, args: string[]) {
  const ctx: CliContext = {
    logger,
    config: loadConfig(),
  };
  return execCommand(ctx, args, commandMap, "help");
}

function helpCommand({ logger }: CliContext) {
  const str = `
lbu -- ${getLbuVersion()}
Lightbase backend utilities. @lbu/* consists of various utility packages for faster and efficient backend development.
This cli contains a template, docker container management and code generation features.

Commands:
- ${Object.keys(commandMap).join("\n- ")}

For more help on a specific command use 'lbu [command] help'.`;

  logger.info(str);
}

function loadConfig(): undefined | Config {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(join(process.cwd(), "lbu.json"));
  } catch (e) {
    return undefined;
  }
}

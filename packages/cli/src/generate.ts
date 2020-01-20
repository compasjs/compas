import { Logger } from "@lbu/insight";
import { join } from "path";
import { lintCommand } from "./lint";
import { CliContext, Command } from "./types";
import { execCommand, getLbuVersion } from "./utils";

const commandMap: Command = {
  help: generateHelpCommand,
};

export const generateCommand: Command = (ctx, args) => {
  if (args.length === 1) {
    return execCommand(ctx, args, commandMap, "help");
  }

  if (!ctx.config || !ctx.config.generate || !ctx.config.generate.inputFile) {
    ctx.logger.error(
      "Top-level key 'generate' is required in the lbu.json file",
    );
    return;
  }

  return executeCodegen(ctx.logger, {
    inputFile: ctx.config.generate.inputFile,
  });
};

async function generateHelpCommand({ logger }: CliContext) {
  const str = `
lbu generate -- ${getLbuVersion()} 
Run all known generators.`;

  logger.info(str);
}

async function executeCodegen(
  logger: Logger,
  { inputFile }: { inputFile: string },
) {
  require("@lbu/register");
  require(join(process.cwd(), inputFile));

  await lintCommand({ logger }, []);
}

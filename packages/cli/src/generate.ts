import { Logger } from "@lbu/insight";
import { runCodeGen } from "@lbu/validator";
import { join } from "path";
import { CliContext, Command } from "./types";
import { execCommand, getLbuVersion } from "./utils";

const commandMap: Command = {
  help: generateHelpCommand,
};

export const generateCommand: Command = (ctx, args) => {
  if (args.length === 1) {
    return execCommand(ctx, args, commandMap, "help");
  }

  if (
    !ctx.config ||
    !ctx.config.generate ||
    !ctx.config.generate.inputFile ||
    !ctx.config.generate.outputDir
  ) {
    ctx.logger.error(
      "Top-level key 'generate' is required in the lbu.json file",
    );
    return;
  }

  return executeCodegen(ctx.logger, {
    inputFile: ctx.config.generate.inputFile,
    outputDir: ctx.config.generate.outputDir,
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
  { inputFile, outputDir }: { inputFile: string; outputDir: string },
) {
  require(join(process.cwd(), inputFile));

  runCodeGen(outputDir);
}

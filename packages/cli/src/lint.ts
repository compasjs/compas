import { spawn } from "@lbu/stdlib";
import { CliContext, Command } from "./types";
import { execCommand, getLbuVersion } from "./utils";

const commandMap: Command = {
  help: lintHelpCommand,
};

export const lintCommand: Command = async (ctx, args) => {
  if (args.length === 1) {
    return execCommand(ctx, args, commandMap, "help");
  }

  await spawn(ctx.logger, "./node_modules/.bin/eslint", [
    "./**/*.ts",
    "--ignore-pattern",
    "*.d.ts",
    "--ignore-pattern",
    "*/dist/*",
    "--fix",
  ]);

  await spawn(ctx.logger, "./node_modules/.bin/prettier", [
    "-l",
    "./**/**.{js,ts,json}",
    "--write",
  ]);

  return;
};

async function lintHelpCommand({ logger }: CliContext) {
  const str = `
lbu lint -- ${getLbuVersion()} 
Run eslint & prettier with both auto-fix turned on.`;

  logger.info(str);
}

import { existsSync } from "fs";
import { Logger } from "../insight";
import { spawn } from "../stdlib";

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

lintCommand.help = "lbf lint -- Run eslint & prettier in the current directory";

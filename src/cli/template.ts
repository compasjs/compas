import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { join } from "path";
import { Logger } from "../insight";
import { isNil, spawn } from "../stdlib";

/**
 * Initialize a new project by copying the template
 */
export async function initCommand(logger: Logger, args: string[]) {
  const sourceDir = join(__dirname, "..", "..", "template");
  const targetDir = !isNil(args[0])
    ? join(process.cwd(), args[0])
    : process.cwd();

  await copyTemplate(logger, sourceDir, targetDir);
}

initCommand.help =
  "lbf init [name] -- Initialize a new project\n\nAny existing file will be overwritten!\nIf [name] is specified a sub directory is created, else the current working directory is used.";

/**
 * Recursively copy template over & npm install dependencies
 */
async function copyTemplate(
  logger: Logger,
  sourceDir: string,
  targetDir: string,
) {
  recursiveCopyDir(sourceDir, targetDir);

  await spawn(logger, "npm", ["install"]);
  await spawn(logger, "npm", ["run", "lint"]);
}

/**
 * Recursively copy over sourceDir to targetDir
 */
export function recursiveCopyDir(sourceDir: string, targetDir: string) {
  ensureDir(targetDir);

  if (lstatSync(sourceDir).isDirectory()) {
    const files = readdirSync(sourceDir);
    for (const file of files) {
      const currentSource = join(sourceDir, file);
      const targetSource = join(targetDir, file);
      if (lstatSync(currentSource).isDirectory()) {
        recursiveCopyDir(currentSource, targetSource);
      } else {
        copyFileSync(currentSource, targetSource);
      }
    }
  }
}

/**
 * Create directory if not exists
 */
export function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

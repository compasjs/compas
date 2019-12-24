import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { join } from "path";
import { Logger } from "../insight";
import { spawn } from "../stdlib";

/**
 * Recursively copy template over & npm install dependencies
 */
export async function copyTemplate(
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
  if (!existsSync) {
    mkdirSync(dir, { recursive: true });
  }
}

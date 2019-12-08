import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { join } from "path";

export function copyTemplate(sourceDir: string, targetDir: string) {
  recursiveCopyDir(sourceDir, targetDir);
  // TODO: yarn install
}

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

export function ensureDir(dir: string) {
  if (!existsSync) {
    mkdirSync(dir);
  }
}

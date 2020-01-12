import { spawnSync } from "child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { CliContext, Command } from "./types";
import { execCommand, getLbuVersion } from "./utils";

const commandMap: Command = {
  help: initHelpCommand,
};

export const initCommand: Command = (ctx, args) => {
  if (args.length === 1) {
    return execCommand(ctx, args, commandMap, "help");
  }

  return execInit();
};

function initHelpCommand({ logger }: CliContext) {
  const str = `
lbu init -- ${getLbuVersion()} 
Inits a new project in the current working directory. This overwrites all existing files.`;

  logger.info(str);
}

function execInit() {
  const outDir = process.cwd();
  // Use current directory name as template name
  const projectName = outDir.substring(outDir.lastIndexOf("/") + 1);
  copyDirRecursive(join(__dirname, "../template/"), outDir, (input: string) =>
    input.replace(/{{template}}/g, projectName),
  );

  spawnSync(`yarn`, { stdio: "inherit" });
  spawnSync(`yarn`, ["lint"], { stdio: "inherit" });
  spawnSync(`yarn`, ["build"], { stdio: "inherit" });
}

function copyDirRecursive(
  sourceDir: string,
  targetDir: string,
  contentHandler: (input: string) => string,
) {
  const stat = lstatSync(sourceDir);
  if (stat.isDirectory()) {
    ensureDir(targetDir);

    const files = readdirSync(sourceDir);
    for (const file of files) {
      const currentSource = join(sourceDir, file);
      const targetSource = join(targetDir, file);

      copyDirRecursive(currentSource, targetSource, contentHandler);
    }
  } else if (stat.isFile()) {
    const src = readFileSync(sourceDir, { encoding: "utf-8" });
    writeFileSync(targetDir, contentHandler(src), { encoding: "utf-8" });
  }
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

import { dirnameForModule, spawn } from "@lbu/stdlib";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join } from "path";

/**
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @returns {Promise<void>}
 */
export async function initCommand(logger, command) {
  const { version } = JSON.parse(
    readFileSync(
      join(dirnameForModule(import.meta), "../../package.json"),
      "utf-8",
    ),
  );

  let outDir = process.cwd();
  if (command.arguments.length === 1) {
    outDir = join(outDir, command.arguments[0]);
  }

  const projectName = outDir.substring(outDir.lastIndexOf("/") + 1);

  copyDirRecursive(
    join(dirnameForModule(import.meta), "../../template"),
    outDir,
    (input) =>
      input.replace(/{{name}}/g, projectName).replace(/{{version}}/g, version),
  );

  await spawn(`yarn`, []);
  await spawn(`yarn`, [`lbu`, `generate`]);
  await spawn(`yarn`, [`lbu`, `lint`]);

  logger.info(`
We already completed your first code generation.

- Try the api with 'yarn lbu api' and try 'http://localhost:3000/app' in your browser
- Discover the utilities of lbu with 'yarn lbu help'

Have fun ;)
`);
}

/**
 * @param source
 * @param target
 * @param contentHandler
 */
function copyDirRecursive(source, target, contentHandler) {
  const stat = lstatSync(source);
  if (stat.isDirectory()) {
    if (!existsSync(target)) {
      mkdirSync(target, { recursive: true });
    }

    const files = readdirSync(source);
    for (const file of files) {
      copyDirRecursive(join(source, file), join(target, file), contentHandler);
    }
  } else if (stat.isFile()) {
    const src = readFileSync(source, "utf-8");
    writeFileSync(target, contentHandler(src), {
      encoding: "utf-8",
    });
  }
}

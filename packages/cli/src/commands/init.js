import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { dirnameForModule, pathJoin, spawn } from "@compas/stdlib";

/**
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @returns {Promise<void>}
 */
export async function initCommand(logger, command) {
  const { version } = JSON.parse(
    readFileSync(
      pathJoin(dirnameForModule(import.meta), "../../package.json"),
      "utf-8",
    ),
  );

  let outDir = process.cwd();
  if (command.arguments.length === 1) {
    outDir = pathJoin(outDir, command.arguments[0]);
  }

  const projectName = outDir.substring(outDir.lastIndexOf("/") + 1);

  copyDirRecursive(
    pathJoin(dirnameForModule(import.meta), "../../template"),
    outDir,
    (input) =>
      input.replace(/{{name}}/g, projectName).replace(/{{version}}/g, version),
  );

  await spawn(`yarn`, []);
  await spawn(`yarn`, [`compas`, `generate`]);
  await spawn(`yarn`, [`compas`, `lint`]);

  logger.info(`
We already completed your first code generation.

- Try the api with 'yarn compas api' and try 'http://localhost:3000/app' in your browser
- Discover the utilities of Compas with 'yarn compas help'

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
      copyDirRecursive(
        pathJoin(source, file),
        pathJoin(target, file),
        contentHandler,
      );
    }
  } else if (stat.isFile()) {
    const src = readFileSync(source, "utf-8");
    writeFileSync(target, contentHandler(src), {
      encoding: "utf-8",
    });
  }
}

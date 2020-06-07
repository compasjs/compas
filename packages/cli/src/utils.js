import { spawn } from "@lbu/stdlib";
import { existsSync, readdirSync, readFileSync } from "fs";
import nodemon from "nodemon";
import { join } from "path";

/**
 * @name CollectedScript
 *
 * Depending on the type contains either script or path
 *
 * @typedef {object}
 * @property {"user"|"package"} type
 * @property {string} name
 * @property {string} [path]
 * @property {string} [script]
 */

/**
 * @name ScriptCollection
 *
 * @typedef {object.<string, CollectedScript>}
 */

/**
 * Return collection of available named scripts
 * - type user: User defined scripts from process.cwd/scripts/*.js
 * - type package: User defined scripts in package.json. These override 'user' scripts
 *
 * @returns {ScriptCollection}
 */
export function collectScripts() {
  const result = {};

  const userDir = join(process.cwd(), "scripts");
  if (existsSync(userDir)) {
    for (const item of readdirSync(userDir)) {
      if (!item.endsWith(".js")) {
        continue;
      }

      const name = item.split(".")[0];

      result[name] = {
        type: "user",
        name,
        path: join(userDir, item),
      };
    }
  }

  const pkgJsonPath = join(process.cwd(), "package.json");
  if (existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
    for (const name of Object.keys(pkgJson.scripts || {})) {
      result[name] = {
        type: "package",
        name,
        script: pkgJson.scripts[name],
      };
    }
  }

  return result;
}

/**
 * @param logger
 * @param verbose
 * @param watch
 * @param command
 * @param commandArgs
 * @param nodemonArgs
 */
export async function executeCommand(
  logger,
  verbose,
  watch,
  command,
  commandArgs,
  nodemonArgs,
) {
  if (verbose) {
    logger.info({
      msg: "Executing command",
      verbose,
      watch,
      command,
      commandArgs,
    });
  }

  if (!watch) {
    return spawn(command, commandArgs);
  }

  nodemon(
    `--exec "${command} ${(commandArgs || []).join(" ")}" ${nodemonArgs || ""}`,
  )
    .once("start", () => {
      if (verbose) {
        logger.info("Script start");
      }
    })
    .on("restart", (files) => {
      if (verbose) {
        if (!files || files.length === 0) {
          logger.info("Script restart manually");
        } else {
          logger.info("Script restart due to file change");
        }
      }
    })
    .on("quit", (signal) => {
      if (verbose) {
        logger.info("LBU quit");
      }
      process.exit(signal);
    })
    .on("crash", (arg) => {
      logger.info("Script crash", arg);
    })
    .on("exit", () => {
      if (verbose) {
        logger.info("Script exit");
      }
    });
}

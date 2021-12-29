import { existsSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { isNil } from "@compas/stdlib";
import {
  collectScripts,
  executeCommand,
  watchOptionsWithDefaults,
} from "../../utils.js";

/**
 * @type {import("../../generated/common/types").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "run",
  shortDescription:
    "Run a JavaScript file, script or file from the scripts directory.",
  modifiers: {
    isCosmetic: true,
  },
  subCommands: [
    {
      name: "script",
      modifiers: {
        isDynamic: true,
      },
      dynamicValidator: (value) => {
        const scriptCollection = collectScripts();
        const isValid = !isNil(scriptCollection[value]) || existsSync(value);

        if (isValid) {
          return {
            isValid,
          };
        }

        return {
          isValid,
          error: {
            message: `Accepts either file names located in the 'scripts' directory, scripts defined in the package.json or file paths to JavaScript files.
Scripts directory: ${Object.entries(scriptCollection)
              .filter(([, value]) => value.type === "user")
              .map(([key]) => key)
              .join(", ")}
Package.json scripts: ${Object.entries(scriptCollection)
              .filter(([, value]) => value.type === "package")
              .map(([key]) => key)
              .join(", ")}
`,
          },
        };
      },
      shortDescription: "The file or script to run.",
    },
  ],
  flags: [
    {
      name: "scriptArguments",
      rawName: "--script-args",
      value: {
        specification: "string",
      },
    },
    {
      name: "nodeArguments",
      rawName: "--node-args",
      value: {
        specification: "string",
      },
    },
  ],
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../types").CliExecutorState} state
 * @returns {Promise<import("../types").CliResult>}
 */
export async function cliExecutor(logger, state) {
  const scriptCollection = collectScripts();
  const scriptName = state.command.at(-1);
  // @ts-ignore
  const script = scriptCollection[scriptName];

  let cmd;
  const args = [];
  let watchOptions = undefined;

  if (script && script.type === "package") {
    cmd = "yarn";
    args.push("run", script.name);
    if (state.flags.scriptArguments) {
      // @ts-ignore
      args.push(...state.flags.scriptsArguments.split(" "));
    }

    // @ts-ignore
    if (state.flags.nodeArguments.length > 0)
      logger.error(
        "Node arguments are not supported if the script is defined in the package.json",
      );
  } else {
    // @ts-ignore
    const src = script ? script.path : path.resolve(scriptName);

    cmd = "node";
    if (state.flags.nodeArguments) {
      // @ts-ignore
      args.push(...state.flags.nodesArguments.split(" "));
    }

    args.push(src);

    if (state.flags.scriptArguments) {
      // @ts-ignore
      args.push(...state.flags.scriptsArguments.split(" "));
    }

    if (state.flags.watch) {
      // Try to import script, to see if it wants to control watch behaviour
      // See CliWatchOptions
      // @ts-ignore
      const f = await import(pathToFileURL(src));

      watchOptions = watchOptionsWithDefaults(f?.cliWatchOptions);
      if (watchOptions.disable) {
        logger.error("Script prevents running in watch mode.");
        state.flags.watch = false;
      }
    }
  }

  const result = await executeCommand(
    logger,
    state.flags.verbose,
    state.flags.watch,
    cmd,
    args,
    watchOptions,
  );

  if (state.flags.watch) {
    return {
      exitStatus: "keepAlive",
    };
  }

  return {
    exitStatus: result?.exitCode === 0 ? "passed" : "failed",
  };
}

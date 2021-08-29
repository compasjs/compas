import { pathToFileURL } from "url";
import { pathJoin } from "@compas/stdlib";
import { executeCommand, watchOptionsWithDefaults } from "../utils.js";

/**
 * @param {Logger} logger
 * @param {import("../parse").ExecCommand} command
 * @param {import("../utils").ScriptCollection} scriptCollection
 * @returns {Promise<void | { exitCode: number; }>}
 */
export async function runCommand(logger, command, scriptCollection) {
  // @ts-ignore
  const script = scriptCollection[command.script];

  let cmd;
  const args = [];
  let watchOptions = undefined;

  if (script && script.type === "package") {
    cmd = "yarn";
    args.push("run", script.name);
    args.push(...command.execArguments);

    if (command.nodeArguments.length > 0) {
      logger.error("Ignoring node arguments in a package.json script");
    }
  } else {
    // @ts-ignore
    const src = script ? script.path : pathJoin(process.cwd(), command.script);

    cmd = "node";
    args.push(...command.nodeArguments);
    args.push(src);
    args.push(...command.execArguments);

    if (command.watch) {
      // Try to import script, to see if it wants to control watch behaviour
      // See CliWatchOptions
      // @ts-ignore
      const f = await import(pathToFileURL(src));

      watchOptions = watchOptionsWithDefaults(f?.cliWatchOptions);
      if (watchOptions.disable) {
        logger.error("Script prevents running in watch mode.");
        command.watch = false;
      }
    }
  }

  return executeCommand(
    logger,
    command.verbose,
    command.watch,
    cmd,
    args,
    watchOptions,
  );
}

import { join, isAbsolute } from "path";
import { executeCommand } from "../utils.js";

/**
 * @param {Logger} logger
 * @param {ExecCommand} command
 * @param {ScriptCollection} scriptCollection
 * @return {Promise<void>}
 */

export async function runCommand(logger, command, scriptCollection) {
  const script = scriptCollection[command.script];

  let cmd;
  let args = [];
  let nodemonArgs = "";

  if (script && script.type === "package") {
    cmd = "yarn";
    args.push("run", script.name);
    args.push(...command.execArguments);

    if (command.nodeArguments.length > 0) {
      logger.error("Ignoring node arguments in a package.json script");
    }
  } else {
    const src = script ? script.path : join(process.cwd(), command.script);

    cmd = "node";
    args.push(...command.nodeArguments);
    args.push(src);
    args.push(...command.execArguments);

    if (command.watch) {
      const f = await import(src);
      if (f.allowNodemon === false) {
        logger.error("Script prevents running in watch mode.");
        command.watch = false;
      }
      nodemonArgs = f.nodemonArgs || "";
    }
  }

  return executeCommand(
    logger,
    command.verbose,
    command.watch,
    cmd,
    args,
    nodemonArgs,
  );
}

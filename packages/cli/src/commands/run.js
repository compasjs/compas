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

  if (script.type === "user") {
    cmd = "node";
    args.push(...command.nodeArguments);
    args.push(script.path);
    args.push(...command.execArguments);

    if (command.watch) {
      const f = await import(script.path);
      if (f.allowNodemon === false) {
        logger.error("Script prevents running in watch mode.");
        command.watch = false;
      }
      nodemonArgs = f.nodemonArgs || "";
    }
  } else if (script.type === "package") {
    cmd = "yarn";
    args.push("run", script.name);
    args.push(...command.execArguments);

    if (command.nodeArguments.length > 0) {
      logger.error("Ignoring node arguments in a package.json script");
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

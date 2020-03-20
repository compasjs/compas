import { isNil, spawn } from "@lbu/stdlib";
import { join } from "path";
import { getKnownScripts } from "./utils.js";

/**
 * @typedef {{
 *   disallowNodemon?: boolean,
 *   nodemonArgs?: string,
 * }} ExecOpts
 */

/**
 * TODO: Watch docs & nodemon customization
 * @param {Logger} logger
 * @param {string} cmd
 * @param {string[]} args
 */
export const execScript = (logger, cmd = "help", args = []) => {
  let watch = false;
  if (cmd === "--watch") {
    watch = true;
    [cmd, ...args] = args;
    cmd = cmd || "help";
  }

  const script = getKnownScripts()[cmd];

  // Support plain js files
  if (isNil(script) && cmd.endsWith(".js")) {
    return execJsFile(
      logger,
      { path: join(process.cwd(), cmd) },
      "SCRIPT",
      [],
      watch,
    );
  }

  if (isNil(script)) {
    logger.info(`Unknown script: ${cmd} with args: ${args.join(",")}`);
    process.exit(1);
  }

  if (script.type === "CLI" || script.type === "USER") {
    return execJsFile(logger, script, cmd, args, watch);
  } else if (script.type === "YARN") {
    return execYarnScript(logger, script, cmd, args, watch);
  }
};

const execJsFile = async (logger, script, cmd, args, watch) => {
  if (watch) {
    const opts = (await import(script.path)) || {};

    if (opts.disallowNodemon) {
      logger.error(`Cannot execute ${cmd} in watch mode`);
      watch = false;
      args = [script.path, ...args];
    } else {
      const nodemonArgs =
        typeof opts.nodemonArgs === "string" && opts.nodemonArgs.length > 0
          ? opts.nodemonArgs.split(" ")
          : [];
      args = [...nodemonArgs, script.path, "--", ...args];
    }
  } else {
    args = [script.path, ...args];
  }

  const executor = watch ? "./node_modules/.bin/nodemon" : "node";

  return spawn(executor, args);
};

const execYarnScript = (logger, script, cmd, args, watch) => {
  if (watch) {
    return spawn(`./node_modules/.bin/nodemon`, [
      "--exec",
      script.script,
      "--",
      ...args,
    ]);
  }

  return spawn(`yarn`, ["run", cmd, ...args]);
};

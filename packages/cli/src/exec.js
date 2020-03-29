import { isNil, spawn } from "@lbu/stdlib";
import nodemon from "nodemon";
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
export function execScript(logger, cmd = "help", args = []) {
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
}

async function execJsFile(logger, script, cmd, args, watch) {
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

  if (watch) {
    execNodemon(logger, args.join(" "));
  } else {
    return spawn("node", args);
  }
}

function execYarnScript(logger, script, cmd, args, watch) {
  if (watch) {
    execNodemon(logger, `--exec "${script.script}" -- ${args.join(" ")}`);
  } else {
    return spawn(`yarn`, ["run", cmd, ...args]);
  }
}

function execNodemon(logger, args) {
  nodemon(args)
    .once("start", () => {
      logger.info("Script start");
    })
    .on("restart", (files) => {
      if (!files || files.length === 0) {
        logger.info("Script restart manually");
      } else {
        logger.info("Script restart due to file change", files);
      }
    })
    .on("quit", (signal) => {
      logger.info("LBU quit");
      process.exit(signal);
    })
    .on("crash", (arg) => {
      logger.info("Script crash", arg);
    })
    .on("exit", () => {
      logger.info("Script exit");
    });
}

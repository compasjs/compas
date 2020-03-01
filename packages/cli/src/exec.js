import { isNil, spawn } from "@lbu/stdlib";
import { join, resolve } from "path";
import { getKnownScripts } from "./utils.js";

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
  const pattern = /^node ([.\w/]*\.js)(.*)$/gi;
  if (watch) {
    const patternResult = pattern.exec(script.script);
    if (patternResult === null) {
      logger.error(
        "Can only convert Yarn scripts to enable watch mode if they look like 'node src/script.js --args'",
      );
    } else {
      return execJsFile(
        logger,
        { path: resolve(patternResult[1]) },
        `yarn run ${cmd}`,
        patternResult[2].split(" "),
        true,
      );
    }
  }

  return spawn(`yarn`, ["run", cmd, ...args]);
};

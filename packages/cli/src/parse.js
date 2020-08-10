import { existsSync } from "fs";

/**
 * List of commands that don't need to parse node args, script args and tooling args
 * @type {string[]}
 */
const utilCommands = ["init", "help", "docker", "proxy"];

/**
 * Object of commands that accept special input like node arguments, script name or
 * tooling args
 * @type {object<string, {canWatch: boolean, useArgDelimiter: string, useScriptOrFile:
 *   boolean, useArgDelimiter: boolean, }>}
 */
const execCommands = {
  run: {
    canWatch: true,
    useScriptOrFile: true,
    useArgDelimiter: false,
  },
  test: {
    canWatch: true,
    useScriptOrFile: false,
    useArgDelimiter: false,
  },
  bench: {
    canWatch: true,
    useScriptOrFile: false,
    useArgDelimiter: false,
  },
  lint: {
    canWatch: true,
    useScriptOrFile: false,
    useArgDelimiter: false,
  },
  coverage: {
    canWatch: true,
    useScriptOrFile: false,
    useArgDelimiter: true,
  },
};

/**
 * Used for checking if an argument is a valid script path
 * @type {RegExp}
 */
const pathRegex = /^([^/]*\/)+(.*)$/;

/**
 * @name UtilCommand
 *
 * @typedef {object}
 * @property {"util"} type
 * @property {string} name
 * @property {string[]} arguments
 * @property {string} [error]
 */

/**
 * @name ExecCommand
 *
 * @typedef {object}
 * @property {"exec"} type
 * @property {string} name
 * @property {string} script
 * @property {boolean} watch
 * @property {boolean} verbose
 * @property {string[]} nodeArguments
 * @property {string[]} execArguments
 * @property {string[]} toolArguments
 */

/**
 * @name ParsedArgs
 *
 * @typedef {UtilCommand|ExecCommand}
 */

/**
 * @param {string[]} args
 * @param {string[]} [knownScripts]
 * @returns {ParsedArgs}
 */
export function parseArgs(args, knownScripts = []) {
  // Default to help
  if (args.length === 0) {
    return {
      type: "util",
      name: "help",
      arguments: [],
    };
  }

  if (utilCommands.indexOf(args[0]) !== -1) {
    return {
      type: "util",
      name: args[0],
      arguments: args.slice(1),
    };
  }

  let defaultedToRun = false;
  let execName = Object.keys(execCommands).find((it) => it === args[0]);

  if (!execName) {
    defaultedToRun = true;
    execName = "run";
  }
  const command = execCommands[execName];

  // Find the index in the argument list of a named script or path to script
  let foundScriptIdx = -1;
  for (let i = 0; i < args.length; ++i) {
    if (i === 0 && !defaultedToRun) {
      continue;
    }

    const item = args[i];

    const isNamedScript = knownScripts.indexOf(item) !== -1;

    const isPathScript =
      !isNamedScript && pathRegex.test(item) && existsSync(item);

    if (isNamedScript || isPathScript) {
      foundScriptIdx = i;
      break;
    }
  }

  if (foundScriptIdx === -1 && command.useScriptOrFile) {
    return buildHelpError(
      args,
      "Could not find script or valid path in the arguments",
    );
  } else if (foundScriptIdx !== -1 && !command.useScriptOrFile) {
    return buildHelpError(
      args,
      `Can not execute ${execName} with a named script or path`,
    );
  }

  let watch = false;
  let verbose = false;
  const lbuAndNodeArguments = args.slice(
    defaultedToRun ? 0 : 1,
    foundScriptIdx === -1 ? args.length : foundScriptIdx,
  );

  const nodeArguments = [];

  for (const arg of lbuAndNodeArguments) {
    if (!watch && arg === "--watch") {
      watch = true;
      continue;
    }
    if (!verbose && arg === "--verbose") {
      verbose = true;
      continue;
    }

    // Use '--' as a special arg delimiter for passing args to other tools
    if (command.useArgDelimiter && arg === "--") {
      break;
    }

    nodeArguments.push(arg);
  }

  // Either have execArguments or tool arguments
  // This is checked based on command.useArgDelimiter
  let execArguments = [];
  let toolArguments = [];

  if (command.useArgDelimiter) {
    const delimiterIndex = args.indexOf("--");
    if (delimiterIndex !== -1) {
      toolArguments = args.slice(delimiterIndex + 1);
    }
  } else {
    execArguments =
      foundScriptIdx === -1
        ? args.slice(defaultedToRun ? 0 : 1)
        : args.slice(foundScriptIdx + 1);
  }

  return {
    type: "exec",
    name: execName,
    script: foundScriptIdx === -1 ? undefined : args[foundScriptIdx],
    watch,
    verbose,
    nodeArguments,
    toolArguments,
    execArguments,
  };
}

/**
 * @param args
 * @param error
 */
function buildHelpError(args, error) {
  return {
    type: "util",
    name: "help",
    arguments: args,
    error,
  };
}

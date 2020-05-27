import { existsSync } from "fs";

const utilCommands = ["init", "help", "docker"];
const execCommands = {
  run: {
    canWatch: true,
    useScriptOrFile: true,
  },
  profile: {
    canWatch: false,
    useScriptOrFile: true,
  },
  test: {
    canWatch: true,
    useScriptOrFile: false,
  },
  lint: {
    canWatch: true,
    useScriptOrFile: false,
  },
};

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
 */

/**
 * @name ParsedArgs
 *
 * @typedef {UtilCommand|ExecCommand}
 */

/**
 * @param {string[]} args
 * @param {string[]} [knownScripts]
 * @return {ParsedArgs}
 */
export function parseArgs(args, knownScripts = []) {
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

  let defaulted = false;
  let execName = Object.keys(execCommands).find((it) => it === args[0]);

  if (!execName) {
    defaulted = true;
    execName = "run";
  }
  const command = execCommands[execName];

  let foundScriptIdx = -1;
  for (let i = 0; i < args.length; ++i) {
    if (i === 0 && !defaulted) {
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
    defaulted ? 0 : 1,
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
    nodeArguments.push(arg);
  }

  return {
    type: "exec",
    name: execName,
    script: foundScriptIdx === -1 ? undefined : args[foundScriptIdx],
    watch,
    verbose,
    nodeArguments,
    execArguments:
      foundScriptIdx === -1
        ? args.slice(defaulted ? 0 : 1)
        : args.slice(foundScriptIdx + 1),
  };
}

function buildHelpError(args, error) {
  return {
    type: "util",
    name: "help",
    arguments: args,
    error,
  };
}

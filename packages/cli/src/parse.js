import { existsSync } from "fs";

/**
 * List of commands that don't need to parse node args, script args and tooling args
 *
 * @type {string[]}
 */
const utilCommands = [
  "init",
  "help",
  "docker",
  "proxy",
  "code-mod",
  "visualise",
];

/**
 * Object of commands that accept special input like node arguments, script name or
 * tooling args
 *
 * @type {Record<string, { useScriptOrFile: boolean, }>}
 */
const execCommands = {
  run: {
    useScriptOrFile: true,
  },
  test: {
    useScriptOrFile: false,
  },
  bench: {
    useScriptOrFile: false,
  },
  lint: {
    useScriptOrFile: false,
  },
  coverage: {
    useScriptOrFile: false,
  },
};

/**
 * Used for checking if an argument is a valid script path
 *
 * @type {RegExp}
 */
const pathRegex = /^([^/]*\/)+(.*)$/;

/**
 * @typedef UtilCommand
 * @property {"util"} type
 * @property {string} name
 * @property {string[]} arguments
 * @property {string} [error]
 */

/**
 * @typedef ExecCommand
 * @property {"exec"} type
 * @property {string} name
 * @property {string|undefined} script
 * @property {boolean} watch
 * @property {boolean} verbose
 * @property {string[]} nodeArguments
 * @property {string[]} execArguments
 */

/**
 * @typedef {UtilCommand|ExecCommand} ParsedArgs
 */

/**
 * @param {string[]} knownNodeArgs
 * @param {string[]} knownScripts
 * @param {string[]} args
 * @returns {ParsedArgs}
 */
export function parseArgs(knownNodeArgs, knownScripts, args) {
  // Default to help
  if (args.length === 0) {
    return {
      type: "util",
      name: "help",
      arguments: [],
    };
  }

  // Util commands get their args passed raw. Node.js and V8 args can't be passed.
  if (utilCommands.indexOf(args[0]) !== -1) {
    return {
      type: "util",
      name: args[0],
      arguments: args.slice(1),
    };
  }

  // Determine command to use, defaulting to 'run'.
  // Which enables `yarn compas generate` instead of `yarn compas run generate`
  let defaultedToRun = false;
  let execName = Object.keys(execCommands).find((it) => it === args[0]);

  if (!execName) {
    defaultedToRun = true;
    execName = "run";
  }

  const command = execCommands[execName];

  // Find the index in the argument list of a named script or path to script
  let foundScriptIdx = -1;
  if (command.useScriptOrFile) {
    for (let i = 0; i < args.length; ++i) {
      // If default to run, the first argument needs evaluation.
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
  }

  if (foundScriptIdx === -1 && command.useScriptOrFile) {
    // @ts-ignore
    return buildHelpError(
      args,
      "Could not find script or valid path in the arguments",
    );
  }

  const nodeArguments = [];
  const execArguments = [];

  let watch = false;
  let verbose = false;

  let lastKnownNodeArgIdx = -1;

  for (let i = 0; i < args.length; ++i) {
    // If default to run, the first argument needs evaluation.
    if (i === 0 && !defaultedToRun) {
      continue;
    }

    // This is the named script, so ignore
    if (i === foundScriptIdx) {
      continue;
    }

    // Compas specific args
    if (args[i] === "--watch") {
      watch = true;
      continue;
    }

    if (args[i] === "--verbose") {
      verbose = true;
      continue;
    }

    // Found script so split is where the script is
    if (i < foundScriptIdx) {
      nodeArguments.push(args[i]);
      continue;
    }
    if (foundScriptIdx !== -1 && i > foundScriptIdx) {
      execArguments.push(args[i]);
      continue;
    }

    // If args is known arg or if last argument was a known arg, we assume it may be a
    // argument to the previous argument.
    const trimmedArg = args[i].split("=")[0];
    const knownNodeArgIdx = knownNodeArgs.indexOf(trimmedArg);
    if (
      knownNodeArgIdx !== -1 ||
      (knownNodeArgIdx - 1 === lastKnownNodeArgIdx && !args[i].startsWith("--"))
    ) {
      nodeArguments.push(args[i]);
      lastKnownNodeArgIdx = knownNodeArgIdx;
      continue;
    }

    execArguments.push(args[i]);
  }

  return {
    type: "exec",
    name: execName,
    script: foundScriptIdx === -1 ? undefined : args[foundScriptIdx],
    watch,
    verbose,
    nodeArguments,
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

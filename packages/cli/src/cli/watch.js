import {
  AppError,
  configLoaderGet,
  eventStart,
  eventStop,
  newEventFromEvent,
} from "@compas/stdlib";
import { watcherRunWithSpawn } from "../watcher/index.js";
import { cliCommandDetermine } from "./command.js";
import { cliParserParseFlags, cliParserSplitArgs } from "./parser.js";

/**
 * Init watch command and flags.Note that we are after the validators. So be good about
 * things.
 * The watch command adds all other commands as their sub commands, this way we can auto
 * complete for sub commands.
 * Also registers `--watch`. Which special case captures the command and rewrites it to a
 * `cli.name watch ...` command.
 *
 * @param {import("./types.js").CliResolved} cli
 */
export function cliWatchInit(cli) {
  cliWatchCheckForReservedKeys(cli);

  cli.subCommands.push({
    name: "watch",

    subCommands: cliWatchFilterCommands(cli.subCommands),
    flags: [],
    shortDescription:
      "Run the command, restarting it when file changes happen.",
    longDescription: `Some commands in this CLI can be watched. 
They can be executed via \`${cli.name} watch [..subCommand]\` or by adding the '--watch' flag when invoking the command.

The watching happens by monitoring all the files in your project and restarting the command once files are changed. Manually restarting is also possible by sending \`rs<enter>\` to the program.

Watch behaviour can be tuned by commands. Setting 'modifiers.isWatchable' to 'true' is necessary for it to allow watching, and 'watchSettings' can be specified with custom extensions to be watched or specific directories to ignore. When watch behavior is needed for custom scripts, following the steps in [extending the cli](https://compasjs.com/features/extending-the-cli.html) is mandatory.

\`\`\`js
export const cliDefinition = {
  name: "my-command",
  shortDescription: "My command",
  modifiers: {
    isWatchable: true, // This is mandatory
  },
  watchSettings: {
    extensions: ["js", "ts"], // Defaults to '["js", "json"]'
    ignorePatterns: ["__fixtures__"], // Defaults to '[".cache", "coverage", "node_modules"]'
  },
}
\`\`\`


You can also add a compas config file at 'config/compas.{js,json}' to specify project specific items. They are appended to the specification of the command and can be used if your tests write files that may trigger the watcher. See the [Compas configuration reference](https://compasjs.com/references/compas-config.html) for more information about the allowed options.

\`\`\`json
{
  "cli": {
   "globalWatchOptions": {
      "extensions": [],
      "ignorePatterns": ["__fixtures__", "test/tmp"]
    }
  }
}
\`\`\`
`,
    modifiers: {
      isCosmetic: false,
      isDynamic: false,
      isWatchable: false,
    },
    watchSettings: {
      extensions: [],
      ignorePatterns: [],
    },
    dynamicValue: {},
    executor: () => {
      throw new Error(
        `This should never happen, please report this to the maintainers of this cli.`,
      );
    },
    parent: cli,
  });

  cliWatchAddFlagToWatchableCommands(cli.name, cli);
}

/**
 *
 * @param {Array<import("./types.js").CliResolved>} commands
 */
function cliWatchFilterCommands(commands) {
  const result = [];

  for (const cmd of commands) {
    if (["help", "watch"].includes(cmd.name)) {
      continue;
    }

    if (cmd.modifiers.isWatchable) {
      result.push(cmd);
    } else if (cmd.subCommands.length > 0) {
      const subResult = cliWatchFilterCommands(cmd.subCommands);
      if (subResult.length > 0) {
        result.push(cmd);
      }
    }
  }

  return result;
}

/**
 * Add the `--watch` flag to all watchable commands.
 *
 * @param {string} cliName
 * @param {import("./types.js").CliResolved} command
 */
function cliWatchAddFlagToWatchableCommands(cliName, command) {
  /** @type {import("../generated/common/types.d.ts").CliFlagDefinition} */
  const flag = {
    name: "watch",
    rawName: "--watch",
    modifiers: {
      isRepeatable: false,
      isRequired: false,
      isInternal: false,
    },
    description: `Run the command, restarting it when file changes happen. See '${cliName} help watch' for more information.`,
    value: {
      specification: "boolean",
    },
  };

  if (command.modifiers.isWatchable) {
    command.flags.push(flag);

    // Flags propagate downwards, so don't add them to sub commands
    return;
  }

  if (["help", "watch"].includes(command.name)) {
    return;
  }

  for (const cmd of command.subCommands) {
    cliWatchAddFlagToWatchableCommands(cliName, cmd);
  }
}

/**
 * Make sure other commands are not using flags and command names used by the 'watch'
 * system.
 *
 * @param {import("./types.js").CliResolved} command
 */
export function cliWatchCheckForReservedKeys(command) {
  if (
    command.name === "watch" ||
    command.flags.find((it) => it.name === "watch" || it.rawName === "--watch")
  ) {
    throw AppError.serverError({
      message:
        "Command name 'watch' and flag names 'watch' and '--watch' are reserved by the buil-in watch command.",
      offendingCommand: `${command.name} - ${command.shortDescription}`,
    });
  }

  if (!["help", "watch"].includes(command.name)) {
    for (const cmd of command.subCommands) {
      cliWatchCheckForReservedKeys(cmd);
    }
  }
}

/**
 *
 * @param {Array<string>} commandArgs
 * @param {Array<string>} flagArgs
 * @returns {boolean}
 */
export function cliWatchShouldRun(commandArgs, flagArgs) {
  return commandArgs[0] === "watch" || flagArgs.includes("--watch");
}

/**
 * Execute command in watch-mode. Checking options based on the command.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("./types.js").CliResolved} cli
 * @param {Array<string>} userInput
 * @returns {Promise<import("@compas/stdlib").Either<string, { message: string }>>}
 */
export async function cliWatchExec(event, cli, userInput) {
  eventStart(event, "cliWatch.exec");

  const userInputWithoutWatch = userInput.filter(
    (it, idx) =>
      it !== "--watch" && ((idx === 0 && it !== "watch") || idx !== 0),
  );

  const { commandArgs } = cliParserSplitArgs(userInputWithoutWatch);

  const command = await cliCommandDetermine(
    newEventFromEvent(event),
    cli,
    userInputWithoutWatch,
  );

  if (command.error) {
    eventStop(event);

    return command;
  }

  const flagResult = await cliParserParseFlags(
    newEventFromEvent(event),
    command.value,
    userInput,
  );

  if (flagResult.error) {
    eventStop(event);

    return flagResult;
  }

  if (!command.value.modifiers.isWatchable) {
    eventStop(event);

    return {
      error: {
        message: `Can't start watcher for '${cli.name} ${commandArgs.join(
          " ",
        )}', since it disallows watching via 'modifiers.isWatchable' in it's definition.`,
      },
    };
  }

  const projectDefaults = await configLoaderGet({
    location: "project",
    name: "compas",
  });

  const chokidarOptions = cliWatchGetChokidarOpts(
    projectDefaults.data.cli?.globalWatchOptions ?? {
      extensions: [],
      ignorePatterns: [],
    },
    command.value.watchSettings,
  );

  await watcherRunWithSpawn(event.log, {
    chokidarOptions,
    spawnArguments: [
      cli.name,
      userInputWithoutWatch,
      {
        stdio: "inherit",
        env: {
          ...process.env,
          PATH: `${process.env.PATH}:./node_modules/.bin`,
        },
      },
    ],
  });

  eventStop(event);

  return {
    value: "keepAlive",
  };
}

/**
 *
 * @param {...import("./types.js").CliResolved["watchSettings"]} settings
 * @returns {import("chokidar").WatchOptions}
 */
function cliWatchGetChokidarOpts(...settings) {
  const patternArray = [/(^|[/\\])\../];

  patternArray.push(
    new RegExp(
      `\\.(?!${settings
        .map((it) => it.extensions ?? [])
        .flat()
        .join("|")})[a-z]{1,8}$`,
    ),
  );

  for (const setting of settings) {
    for (const pattern of setting?.ignorePatterns ?? []) {
      patternArray.push(new RegExp(pattern));
    }
  }

  const cwd = process.cwd();

  return {
    persistent: true,
    ignorePermissionErrors: true,
    cwd,
    ignored: (path) => {
      if (path.startsWith(cwd)) {
        path = path.substring(cwd.length);
      }

      for (const pattern of patternArray) {
        if (pattern.test(path)) {
          return true;
        }
      }

      return false;
    },
  };
}

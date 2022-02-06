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
 * @param {import("./types").CliResolved} cli
 */
export function cliWatchInit(cli) {
  cliWatchCheckForReservedKeys(cli);

  cli.subCommands.push({
    name: "watch",

    // Not sure why this is needed, but we get weird behavior if we
    // do `subCommands: cli.subCommands`
    //
    // - compas run ./path/to/cli/completions.test.js doesn't exit
    // - compas test also doesn't exit, and the worker just hangs in
    //   the teardown
    subCommands: [...cli.subCommands],

    flags: [],
    shortDescription:
      "Run the command, restarting it when file changes happen.",
    longDescription: "// TODO",
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

  cli.flags.push({
    name: "watch",
    rawName: "--watch",
    modifiers: {
      isRepeatable: false,
      isRequired: false,
      isInternal: false,
    },
    description: "Run the command, restarting it when file changes happen.",
    value: {
      specification: "boolean",
    },
  });
}

/**
 * Make sure other commands are not using flags and command names used by the 'watch'
 * system.
 *
 * @param {import("./types").CliResolved} command
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
 * @param {string[]} commandArgs
 * @param {string[]} flagArgs
 * @returns {boolean}
 */
export function cliWatchShouldRun(commandArgs, flagArgs) {
  return commandArgs[0] === "watch" || flagArgs.includes("--watch");
}

/**
 * Execute command in watch-mode. Checking options based on the command.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("./types").CliResolved} cli
 * @param {string[]} userInput
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
    return flagResult;
  }

  if (!command.value.modifiers.isWatchable) {
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
 * @param {...import("./types").CliResolved["watchSettings"]} settings
 * @returns {import("chokidar").WatchOptions}
 */
function cliWatchGetChokidarOpts(...settings) {
  const patternArray = [/(^|[/\\])\../];

  patternArray.push(
    new RegExp(
      `\\.(?!${settings
        .map((it) => it.extensions)
        .flat()
        .join("|")})[a-z]{1,8}$`,
    ),
  );

  for (const setting of settings) {
    for (const pattern of setting.ignorePatterns) {
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

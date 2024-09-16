import {
  AppError,
  eventStart,
  eventStop,
  newEventFromEvent,
} from "@compas/stdlib";
import {
  cliParserGetKnownFlags,
  cliParserParseCommand,
  cliParserSplitArgs,
} from "./parser.js";

/**
 * Init help command and flags. Note that we are after the validators. So be good about
 * things.
 * The help command adds all other commands as their sub commands, this way we can auto
 * complete for sub commands.
 * Also registers both `-h` and `--help`. The `-h` is officially not allowed, but works
 * after the validators.
 *
 * @param {import("./types.js").CliResolved} cli
 */
export function cliHelpInit(cli) {
  cliHelpCheckForReservedKeys(cli);

  cli.subCommands.push({
    name: "help",
    subCommands: cli.subCommands,
    flags: [],
    shortDescription: "Display help for any of the available commands.",
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

  cli.flags.push(
    {
      name: "help",
      rawName: "-h",
      modifiers: {
        isRepeatable: false,
        isRequired: false,
        isInternal: false,
      },
      description: "Display information about the current command.",
      value: {
        specification: "boolean",
      },
    },
    {
      name: "help",
      rawName: "--help",
      modifiers: {
        isRepeatable: false,
        isRequired: false,
        isInternal: false,
      },
      description: "Display information about the current command.",
      value: {
        specification: "boolean",
      },
    },
  );
}

/**
 * Make sure other commands are not using flags and command names used by the 'help'
 * system.
 *
 * @param {import("./types.js").CliResolved} command
 */
export function cliHelpCheckForReservedKeys(command) {
  if (
    command.name === "help" ||
    command.flags.find(
      (it) =>
        it.name === "help" || it.rawName === "-h" || it.rawName === "--help",
    )
  ) {
    throw AppError.serverError({
      message:
        "Command name 'help' and flag names 'help', '-h' and '--help' are reserved by the buil-in help command.",
      offendingCommand: `${command.name} - ${command.shortDescription}`,
    });
  }

  if (!["help", "watch"].includes(command.name)) {
    for (const cmd of command.subCommands) {
      cliHelpCheckForReservedKeys(cmd);
    }
  }
}

/**
 *
 * @param {Array<string>} commandArgs
 * @param {Array<string>} flagArgs
 * @returns {boolean}
 */
export function cliHelpShouldRun(commandArgs, flagArgs) {
  return (
    commandArgs[0] === "help" ||
    flagArgs.includes("-h") ||
    flagArgs.includes("--help")
  );
}

/**
 * Print help message for the specified command
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("./types.js").CliResolved} cli
 * @param {Array<string>} userInput
 * @returns {Promise<import("@compas/stdlib").Either<string, { message: string }>>}
 */
export async function cliHelpGetMessage(event, cli, userInput) {
  eventStart(event, "cliHelp.getMessage");

  // Filter out help, so we can use the input again to determine the command that we need
  // to print help for.
  const userInputWithoutHelp = userInput.filter(
    (it, idx) =>
      it !== "-h" &&
      it !== "--help" &&
      ((idx === 0 && it !== "help") || idx !== 0),
  );

  const { commandArgs } = cliParserSplitArgs(userInputWithoutHelp);

  // Use parse directly, since cliCommandDetermine, would recursively select the help
  // command in case of for example a `modifiers.isCosmetic` command
  const command = await cliParserParseCommand(
    newEventFromEvent(event),
    cli,
    commandArgs,
  );

  if (command.error) {
    eventStop(event);
    return command;
  }

  const knownFlagsMap = cliParserGetKnownFlags(command.value);

  /** @type {Array<import("../generated/common/types.d.ts").CliFlagDefinition>} */
  // @ts-ignore
  const knownFlags = [
    ...knownFlagsMap.values(),
    { ...knownFlagsMap.get("-h"), rawName: "-h, --help" },
  ]
    .filter(
      (it) =>
        it.rawName !== "-h" &&
        it.rawName !== "--help" &&
        !it.modifiers?.isInternal,
    )
    .sort((a, b) => a.rawName.localeCompare(b.rawName));

  const subCommands = command.value.subCommands
    .filter((it) => !it.modifiers.isDynamic)
    .sort((a, b) => a.name.localeCompare(b.name));

  const dynamicSubCommand = command.value.subCommands.find(
    (it) => it.modifiers.isDynamic,
  );

  let synopsis = commandArgs.join(" ");

  if (subCommands.length && command.value.modifiers.isCosmetic) {
    synopsis += " COMMAND";
  } else if (subCommands.length) {
    synopsis += " [COMMAND]";
  } else if (dynamicSubCommand) {
    synopsis += ` {${dynamicSubCommand.name}}`;
  }

  synopsis = synopsis.trim();

  const value = `

Usage: ${cli.name} ${synopsis}

${command.value.shortDescription}
${command.value.longDescription ? `\n${command.value.longDescription}\n` : "\n"}
Commands:
${formatTable(
  subCommands.map((it) => {
    return {
      key: `${it.modifiers.isDynamic ? "{" : ""}${it.name}${
        it.modifiers.isDynamic ? "}" : ""
      }`,
      value: it.shortDescription ?? "",
    };
  }),
)}

Flags:
${formatTable(
  knownFlags.map((it) => {
    return {
      key: it.rawName,
      value: `${it.description ?? ""} (${it.modifiers.isRequired ? "!" : ""}${
        it.value.specification
      }${it.modifiers.isRepeatable ? "[]" : ""})`.trim(),
    };
  }),
)}

Run '${cli.name} help ${synopsis}' for more information of a specific sub command.
`;

  eventStop(event);
  return {
    value,
  };
}

function formatTable(input) {
  let longestKey = 0;

  for (const item of input) {
    longestKey = Math.max(longestKey, item.key.length);
  }

  // Add spacing between columns
  longestKey += 4;

  // Make sure we don't go over interactive terminal width. Also subtracts some to get
  // some margin
  const maxWidth = (process.stdout.columns ?? Number.MAX_SAFE_INTEGER) - 2;

  for (const item of input) {
    item.key = `  ${item.key.padEnd(longestKey, " ")}`;

    let value = "";

    let column = item.key.length;
    for (const word of item.value.split(" ")) {
      if (column + word.length >= maxWidth) {
        column = item.key.length;
        value += `\n   ${"".padEnd(longestKey, " ")}`;
      } else {
        value += " ";
        column += 1;
      }

      value += word;
      column += word.length;
    }

    item.value = value;
  }

  return input.map((it) => `${it.key}${it.value}`).join("\n");
}

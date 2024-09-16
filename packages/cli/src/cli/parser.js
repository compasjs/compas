import { eventStart, eventStop, isNil } from "@compas/stdlib";
import { cliCommandGetRoot } from "./command.js";

/**
 * Get the sub commands and flags in separate arrays
 *
 * @param {Array<string>} args
 * @returns {{commandArgs: Array<string>, flagArgs: Array<string>}}
 */
export function cliParserSplitArgs(args) {
  for (let i = 0; i < args.length; ++i) {
    // Match '-h' exact, since it is the only flag with a single '-'
    if (args[i].startsWith("--") || args[i] === "-h") {
      return {
        commandArgs: args.slice(0, i),
        flagArgs: args.slice(i),
      };
    }
  }

  return {
    commandArgs: args,
    flagArgs: [],
  };
}

/**
 *
 * @param {import("./types.js").CliResolved} command
 * @returns {Map<string, import("../generated/common/types.d.ts").CliFlagDefinition>}
 */
export function cliParserGetKnownFlags(command) {
  const result = new Map();

  while (command) {
    for (const flag of command.flags) {
      result.set(flag.rawName, flag);
    }

    if (command.parent) {
      command = command.parent;
    } else {
      break;
    }
  }

  return result;
}

/**
 * Parse the command to use
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("./types.js").CliResolved} cli
 * @param {Array<string>} args
 * @returns {Promise<import("@compas/stdlib").Either<import("./types.js").CliResolved, {
 *     message: string,
 * }>>}
 */
export async function cliParserParseCommand(event, cli, args) {
  eventStart(event, "cliParser.parseCommand");

  let foundCommand = cli;

  const input = [cli.name, ...args];

  for (let i = 1; i < input.length; i++) {
    const arg = input[i];

    const directMatch = foundCommand.subCommands.find((it) => it.name === arg);
    const dynamicMatch = foundCommand.subCommands.find(
      (it) => it.modifiers.isDynamic,
    );

    if (directMatch) {
      foundCommand = directMatch;
    } else if (dynamicMatch) {
      if (dynamicMatch.dynamicValue.validator) {
        const { isValid, error } = await Promise.resolve(
          dynamicMatch.dynamicValue.validator(arg),
        );
        if (!isValid) {
          eventStop(event);

          return {
            error: {
              message: `Invalid sub command '${arg}' for '${input
                .slice(0, i)
                .join(" ")}'.\n${error?.message}`,
            },
          };
        }
      }
      foundCommand = dynamicMatch;
    } else {
      const userInputTillCurrent = input.slice(0, i).join(" ");
      const userInputWithCurrent = input.slice(0, i + 1).join(" ");

      const availableSubCommands = foundCommand.subCommands
        .filter((it) => !it.modifiers.isDynamic)
        .map((it) => it.name);
      const options = availableSubCommands
        .sort()
        .map((it) => `  - ${userInputTillCurrent} ${it}`);

      let text = `No sub commands available for '${userInputTillCurrent}'.`;

      if (options.length === 1) {
        text = `Invalid command '${userInputWithCurrent}'. Did you mean '${userInputTillCurrent} ${availableSubCommands[0]}'?`;
      } else if (options.length > 1) {
        text = `Invalid command '${userInputWithCurrent}'. Did you mean one of: \n${options.join(
          "\n",
        )}`;
      }

      eventStop(event);
      return {
        error: {
          message: text,
        },
      };
    }
  }

  eventStop(event);

  return {
    value: foundCommand,
  };
}

/**
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("./types.js").CliResolved} command
 * @param {Array<string>} userInput
 * @returns {Promise<import("@compas/stdlib").Either<any, { message: string }>>}
 */
export async function cliParserParseFlags(event, command, userInput) {
  eventStart(event, "cliParser.parseFlags");

  const cli = cliCommandGetRoot(command);
  const { commandArgs, flagArgs } = cliParserSplitArgs(userInput);

  const genericErrorMessage = `See '${cli.name} ${commandArgs.join(
    " ",
  )} --help' for more information.`;

  const availableFlags = cliParserGetKnownFlags(command);
  const result = {};

  let i = 0;

  const next = () => {
    const value = flagArgs[i];
    i++;
    return value;
  };

  const peek = () => flagArgs[i] ?? "";

  while (!isNil(flagArgs[i])) {
    const rawFlag = next().split("=");
    const flagName = rawFlag[0];

    const flagDefinition = availableFlags.get(flagName);

    if (isNil(flagDefinition)) {
      eventStop(event);
      return {
        error: {
          // TODO: always add help text for flags of this specific command?
          message: `Unknown flag: '${rawFlag.join("=")}'.\n\n${genericErrorMessage}`,
        },
      };
    }

    const nextInput = peek();
    const rawValue =
      isNil(rawFlag[1]) ?
        nextInput.startsWith("--") || nextInput === "-h" ?
          undefined
        : next()
      : rawFlag[1];

    const validatedFlagValue = await cliParserValidateFlag(
      flagDefinition,
      rawValue,
      genericErrorMessage,
    );

    if (validatedFlagValue.error) {
      eventStop(event);
      return validatedFlagValue;
    }

    if (flagDefinition.modifiers.isRepeatable) {
      if (isNil(result[flagDefinition.name])) {
        result[flagDefinition.name] = [validatedFlagValue.value];
      } else {
        result[flagDefinition.name].push(validatedFlagValue.value);
      }
    } else if (
      !flagDefinition.modifiers.isRepeatable &&
      !isNil(result[flagDefinition.name])
    ) {
      eventStop(event);
      return {
        error: {
          message: `Flag '${flagDefinition.rawName}' is not repeatable, but has be found more than once in the input.\n\n${genericErrorMessage}`,
        },
      };
    } else {
      result[flagDefinition.name] = validatedFlagValue.value;
    }
  }

  // Check required flags
  const missingFlags = [];
  for (const flag of availableFlags.values()) {
    if (!flag.modifiers.isRequired) {
      continue;
    }

    if (isNil(result[flag.name])) {
      missingFlags.push(flag.rawName);
    }
  }

  if (missingFlags.length > 0) {
    eventStop(event);
    return {
      error: {
        message: `Missing required flags: ${missingFlags
          .map((it) => `'${it}'`)
          .join(", ")}.\n\n${genericErrorMessage}`,
      },
    };
  }

  eventStop(event);

  return {
    value: result,
  };
}

/**
 * Statically validate & convert a flag, and call it's validator if available.
 *
 * @param {import("../generated/common/types.d.ts").CliFlagDefinition} flag
 * @param {string|undefined} value
 * @param {string} genericErrorMessage
 * @returns {Promise<import("@compas/stdlib").Either<boolean|string|number, { message:
 *   string }>>}
 */
async function cliParserValidateFlag(flag, value, genericErrorMessage) {
  let resolvedValue = undefined;

  if (flag.value.specification === "boolean") {
    if (isNil(value)) {
      resolvedValue = true;
    } else if (value.toLowerCase() === "true" || value === "1") {
      resolvedValue = true;
    } else if (value.toLowerCase() === "false" || value === "0") {
      resolvedValue = false;
    } else {
      return {
        error: {
          message: `Invalid argument '${flag.rawName} ${value}'. Value should be one of: empty (true), true, 1, false, 0.\n\n${genericErrorMessage}`,
        },
      };
    }
  } else if (flag.value.specification === "number") {
    if (isNil(value)) {
      return {
        error: {
          message: `Argument '${flag.rawName}' expects an value that is parseable to a number.\n\n${genericErrorMessage}`,
        },
      };
    }

    resolvedValue = Number(value);
    if (!Number.isFinite(resolvedValue)) {
      return {
        error: {
          message: `Invalid argument '${flag.rawName} ${value}'. Could not parse the value as a finite number.\n\n${genericErrorMessage}`,
        },
      };
    }
  } else if (flag.value.specification === "string") {
    if (isNil(value)) {
      return {
        error: {
          message: `Argument '${flag.rawName}' expects a value.\n\n${genericErrorMessage}`,
        },
      };
    }
    resolvedValue = value;
  } else if (flag.value.specification === "booleanOrString") {
    if (isNil(value)) {
      resolvedValue = true;
    } else if (value.toLowerCase() === "true" || value === "1") {
      resolvedValue = true;
    } else if (value.toLowerCase() === "false" || value === "0") {
      resolvedValue = false;
    } else {
      resolvedValue = value;
    }
  }

  if (flag.value.validator) {
    const result = await flag.value.validator(resolvedValue);
    if (!result.isValid) {
      return {
        error: {
          message: `Invalid argument '${flag.rawName} ${value}'. ${result.error?.message}\n\n${genericErrorMessage}`,
        },
      };
    }
  }

  // @ts-ignore
  return {
    value: resolvedValue,
  };
}

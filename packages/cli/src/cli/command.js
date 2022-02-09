import {
  eventStart,
  eventStop,
  isNil,
  newEventFromEvent,
} from "@compas/stdlib";
import { cliHelpShouldRun } from "./help.js";
import { cliParserParseCommand, cliParserSplitArgs } from "./parser.js";
import { cliWatchShouldRun } from "./watch.js";

/**
 * Get the CLI root, skips 'help'.
 *
 * @param {import("./types").CliResolved} command
 * @returns {import("./types").CliResolved}
 */
export function cliCommandGetRoot(command) {
  if (command.parent) {
    return cliCommandGetRoot(command.parent);
  }

  return command;
}

/**
 * Determine the command that we are working with.
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("./types").CliResolved} cli
 * @param {string[]} input
 * @returns {Promise<import("@compas/stdlib").Either<import("./types").CliResolved, {
 *   message: string }>>}
 */
export async function cliCommandDetermine(event, cli, input) {
  eventStart(event, "cliCommand.determine");

  const { commandArgs, flagArgs } = cliParserSplitArgs(input);

  const commandResult = await cliParserParseCommand(
    newEventFromEvent(event),
    cli,
    commandArgs,
  );

  if (commandResult.error) {
    return commandResult;
  }

  if (
    cliHelpShouldRun(commandArgs, flagArgs) ||
    commandResult.value.modifiers.isCosmetic
  ) {
    // @ts-ignore
    return {
      value: cli.subCommands.find((it) => it.name === "help"),
    };
  } else if (cliWatchShouldRun(commandArgs, flagArgs)) {
    // @ts-ignore
    return {
      value: cli.subCommands.find((it) => it.name === "watch"),
    };
  }

  eventStop(event);
  return commandResult;
}

/**
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("./types").CliResolved} cli
 * @param {import("./types").CliResolved} command
 * @param {Record<string, any>} flags
 * @param {string[]} userInput
 * @returns {Promise<import("@compas/stdlib").Either<import("./types").CliResult, {
 *   message: string }>>}
 */
export async function cliCommandExec(
  event,
  logger,
  cli,
  command,
  flags,
  userInput,
) {
  eventStart(event, "cliCommand.exec");

  const { commandArgs } = cliParserSplitArgs(userInput);

  let commandWithExecutor = command;
  while (!commandWithExecutor.executor && commandWithExecutor.parent) {
    commandWithExecutor = commandWithExecutor.parent;
  }

  if (isNil(commandWithExecutor?.executor)) {
    return {
      error: {
        message: `Command executor is missing for '${
          cli.name
        } ${commandArgs.join(
          " ",
        )}'. This should never happen. Please report this to the maintainers.`,
      },
    };
  }

  const result = await commandWithExecutor.executor(logger, {
    cli,
    command: commandArgs,
    flags,
  });

  eventStop(event);

  return {
    value: result,
  };
}

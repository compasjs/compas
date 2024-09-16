import {
  AppError,
  dirnameForModule,
  eventStart,
  eventStop,
  isNil,
  newEventFromEvent,
  pathJoin,
} from "@compas/stdlib";
import { validateCliCommandDefinition } from "../generated/cli/validators.js";
import { cliHelpInit } from "./help.js";
import { cliLoaderLoadDirectories } from "./loader.js";
import { lowerCaseFirst } from "./utils.js";
import { cliWatchInit } from "./watch.js";

/**
 *
 * @param {import("@compas/stdlib").InsightEvent} event
 * @param {import("../generated/common/types.d.ts").CliCommandDefinitionInput} root
 * @param {{
 *   commandDirectories: Array<{
 *     directory: string,
 *     validateOnLoad: boolean,
 *   }>,
 * }} options
 * @returns {Promise<import("./types.js").CliResolved>}
 */
export async function cliInit(event, root, options) {
  eventStart(event, "cli.init");

  options.commandDirectories.unshift({
    directory: pathJoin(dirnameForModule(import.meta), "./internal-commands"),
    validateOnLoad: false,
  });

  root.subCommands = await cliLoaderLoadDirectories(newEventFromEvent(event), {
    inputs: options.commandDirectories,
  });

  const validateResult = validateCliCommandDefinition(root);
  if (validateResult.error) {
    eventStop(event);
    throw validateResult.error;
  }

  /** @type {import("./types.js").CliResolved} */
  const cli = validateResult.value;
  cliInitValidateCommands(cli);
  cliInitValidateFlags(cli);

  cliHelpInit(cli);
  cliWatchInit(cli);

  cliInitAddDefaultCompletions(cli);

  eventStop(event);

  return validateResult.value;
}

/**
 * Recursively go through commands and do some normalizing and various checks
 *
 * @param {import("./types.js").CliResolved} command
 * @param {boolean} hasParentWithExecutor
 */
function cliInitValidateCommands(command, hasParentWithExecutor = false) {
  command.name = lowerCaseFirst(command.name);

  const subCommandNameSet = new Set();
  let hasDynamic = false;

  if (command.modifiers.isCosmetic && command.subCommands.length === 0) {
    throw AppError.serverError({
      message:
        "If a command is 'modifiers.isCosmetic', it should have sub commands.",
      command: command.name,
    });
  }

  if (
    !command.modifiers.isCosmetic &&
    !hasParentWithExecutor &&
    isNil(command.executor)
  ) {
    throw AppError.serverError({
      message:
        "If a command is not cosmetic and does not have a parent that did define an executor, it should have an 'executor' function defined in it's definition.",
      command: command.name,
    });
  }

  for (const cmd of command.subCommands) {
    if (
      subCommandNameSet.has(cmd.name) ||
      subCommandNameSet.has(lowerCaseFirst(cmd.name))
    ) {
      throw AppError.serverError({
        message: "Multiple sub commands resolve to the same name",
        command: command.name,
        resolvedSubCommand: lowerCaseFirst(cmd.name),
      });
    }

    if (cmd.modifiers.isDynamic) {
      if (hasDynamic) {
        throw AppError.serverError({
          message: "Only a single sub command can be dynamic.",
          command: command.name,
          subCommand: cmd.name,
        });
      }

      hasDynamic = true;
    }

    cmd.parent = command;

    subCommandNameSet.add(cmd.name);
    subCommandNameSet.add(lowerCaseFirst(cmd.name));

    cliInitValidateCommands(
      cmd,
      hasParentWithExecutor || !isNil(command.executor),
    );
  }
}

/**
 *
 * @param {import("./types.js").CliResolved} command
 * @param {Array<string>} existingFlags
 */
function cliInitValidateFlags(command, existingFlags = []) {
  for (const flag of command.flags) {
    flag.name = lowerCaseFirst(flag.name);

    if (
      existingFlags.includes(flag.name) ||
      existingFlags.includes(flag.rawName)
    ) {
      throw AppError.serverError({
        message:
          "Sub commands can't set flags with the same name as set by one of their parents",
        command: command.name,
        flag: {
          name: flag.name,
          rawName: flag.rawName,
        },
      });
    }

    existingFlags.push(flag.name, flag.rawName);
  }

  for (const cmd of command.subCommands) {
    const flagLength = existingFlags.length;
    cliInitValidateFlags(cmd, existingFlags);

    // Sub commands on the same level, can define the same flags.
    existingFlags.splice(flagLength);
  }
}

/**
 * Add completion functions to `command.dynamicValue.completions' and
 * 'flag.value.completions'
 *
 * @param {import("./types.js").CliResolved} command
 */
function cliInitAddDefaultCompletions(command) {
  if (command.modifiers.isDynamic && isNil(command.dynamicValue.completions)) {
    command.dynamicValue.completions = () => {
      return {
        completions: [
          {
            type: "value",
            specification: "string",
            description: `Dynamic value for '${command.name}'.`,
          },
        ],
      };
    };
  }

  for (const flag of command.flags) {
    if (!isNil(flag.value.completions)) {
      continue;
    }

    flag.value.completions = () => {
      return {
        completions: [
          {
            type: "value",
            specification: flag.value.specification,
            description: flag.description,
          },
        ],
      };
    };
  }

  if (!["help", "watch"].includes(command.name)) {
    for (const cmd of command.subCommands) {
      cliInitAddDefaultCompletions(cmd);
    }
  }
}

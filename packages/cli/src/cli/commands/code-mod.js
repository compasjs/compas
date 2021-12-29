import { eventStart, eventStop, isNil, newEvent } from "@compas/stdlib";
import { codeModMap } from "../../code-mod/constants.js";

const codeModNameFlagValidator = (value) => {
  const isValid = !isNil(codeModMap[value]);

  if (isValid) {
    return {
      isValid,
    };
  }

  return {
    isValid,
    error: {
      message: `The available names are:\n${Object.keys(codeModMap).join(
        ", ",
      )}\n\nTo get more details of a specific code-mod run 'compas code-mod list'.`,
    },
  };
};

/**
 * @type {import("../../generated/common/types").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "code-mod",
  shortDescription:
    "Execute code-mods to help migrating to new Compas versions.",
  modifiers: {
    isCosmetic: true,
  },
  subCommands: [
    {
      name: "list",
      shortDescription: "List the available code-mods",
    },
    {
      name: "exec",
      shortDescription: "Execute the specified code-mod",
      flags: [
        {
          name: "codeModName",
          rawName: "--name",
          modifiers: {
            isRequired: true,
          },
          value: {
            specification: "string",
            validator: codeModNameFlagValidator,
          },
        },
      ],
    },
  ],
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../types").CliExecutorState} state
 * @returns {Promise<import("../types").CliResult>}
 */
export async function cliExecutor(logger, state) {
  if (state.command.includes("list")) {
    let str = `Available code-mods:\n`;
    for (const [key, value] of Object.entries(codeModMap)) {
      str += `- ${key}: ${value.description}\n`;
    }
    logger.info(str);

    return {
      exitStatus: "passed",
    };
  }

  if (state.command.includes("exec")) {
    /** @type {string} */
    // @ts-ignore
    const codeModName = state.flags.codeModName;

    const selectedCodeMod = codeModMap[codeModName];

    logger.info(
      `Executing '${codeModName}' code-mod.\nDescription: ${selectedCodeMod.description}`,
    );

    const event = newEvent(logger);
    eventStart(event, `cli.codeMod.${codeModName}`);

    await Promise.resolve(selectedCodeMod.exec(event, !!state.flags.verbose));

    if (state.flags.verbose) {
      // Only print call stack if verbose is set
      eventStop(event);
    }

    return {
      exitStatus: "passed",
    };
  }

  return {
    exitStatus: "passed",
  };
}

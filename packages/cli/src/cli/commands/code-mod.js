import { eventStart, eventStop, isNil, newEvent } from "@compas/stdlib";
import { codeModMap } from "../../code-mod/constants.js";

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
          valueSpecification: "string",
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
    if (isNil(selectedCodeMod)) {
      logger.error(
        `Unknown code-mod '${codeModName}' provided. To see a list of available code-mods use 'compas code-mod list'. To execute a code-mod use 'compas code-mod exec $name'.`,
      );
      return { exitStatus: "failed" };
    }

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

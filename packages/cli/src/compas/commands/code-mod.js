import { isNil } from "@compas/stdlib";
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
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "code-mod",
  shortDescription:
    "Execute code-mods to help migrating to new Compas versions.",
  longDescription: `Since Compas generates quite a bit of boilerplate, this command can help you migrate to new Compas versions that have breaking changes in generated code. By detecting usage patterns of the generated output of a previous Compas version, it can migrate (most of) your usages to whatever the new version brings.`,
  modifiers: {
    isCosmetic: true,
  },
  subCommands: [
    {
      name: "list",
      shortDescription: "List the available code-mods.",
    },
    {
      name: "exec",
      shortDescription: "Execute the specified code-mod.",
      flags: [
        {
          name: "codeModName",
          rawName: "--name",
          description: "The code-mod name to execute.",
          modifiers: {
            isRequired: true,
          },
          value: {
            specification: "string",
            validator: codeModNameFlagValidator,
            completions: () => {
              return {
                completions: Object.entries(codeModMap).map(([key, value]) => ({
                  type: "completion",
                  name: key,
                  description: value.description,
                })),
              };
            },
          },
        },
      ],
    },
  ],
  executor: cliExecutor,
};

/**
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export async function cliExecutor(logger, state) {
  if (state.command.includes("list")) {
    let str = `Available code-mods:\n`;
    for (const [key, value] of Object.entries(codeModMap)) {
      str += `- ${key}:
  ${value.description}
  
  Execute with '${state.cli.name} code-mod exec --name ${key}'

`;
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

    logger.info(`Executing '${codeModName}' code-mod.\n`);

    await Promise.resolve(selectedCodeMod.exec(logger));
    return {
      exitStatus: "passed",
    };
  }

  return {
    exitStatus: "passed",
  };
}

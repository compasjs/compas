import { appendFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { AppError, environment, isNil } from "@compas/stdlib";
import { cliParserGetKnownFlags, cliParserSplitArgs } from "../parser.js";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "completions",
  flags: [
    {
      name: "getCompletions",
      rawName: "--get-completions",
      value: {
        specification: "booleanOrString",
      },
      modifiers: {
        isInternal: true,
      },
      description:
        "This flag is used in the completions executor with the current user input so we can determine completions dynamically.",
    },
  ],
  shortDescription: "Configure shell auto-complete for this CLI.",
  executor: async (...args) => {
    try {
      return await cliExecutor(...args);
    } catch (e) {
      if (environment.COMPAS_DEBUG_COMPLETIONS === "true") {
        await writeFile(
          "./error.json",
          JSON.stringify(
            {
              now: new Date().toISOString(),
              error: AppError.format(e),
            },
            null,
            2,
          ),
        );
      }
      throw e;
    }
  },
};

/**
 * Auto completes commands, flags, flag values
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("../../cli/types.js").CliExecutorState} state
 * @returns {Promise<import("../../cli/types.js").CliResult>}
 */
export async function cliExecutor(logger, state) {
  const isZSH =
    environment.SHELL?.includes("zsh") ??
    environment.ZSH_NAME?.includes("zsh") ??
    false;

  if (!isZSH) {
    logger.info("This CLI only supports completions for ZSH.");

    return {
      exitStatus: "failed",
    };
  }

  if (isNil(state.flags.getCompletions)) {
    // TODO: Disable JSON logger?
    printCompletionScripts(state.cli);

    return {
      exitStatus: "passed",
    };
  }

  // We use \t as the separator when passing the current command to be auto-completed to
  // '--get-completions'
  /** @type {string[]} */
  // @ts-ignore
  const inputCommand = state.flags.getCompletions.split("\t");

  const { commandCompletions, flagCompletions } =
    await completionsGetCompletions(state.cli, inputCommand);

  completionsPrintForZsh(commandCompletions, flagCompletions);

  return {
    exitStatus: "passed",
  };
}

/**
 * Resolve completions for the cli and input array
 *
 * @param {import("../types").CliResolved} cli
 * @param {string[]} input
 * @returns {Promise<{
 *   commandCompletions: CliCompletion[],
 *   flagCompletions: CliCompletion[],
 * }>}
 */
export async function completionsGetCompletions(cli, input) {
  /** @type {CliCompletion[]} */
  let commandCompletions = [];
  /** @type {CliCompletion[]} */
  let flagCompletions = [];

  const command = completionsMatchCommand(cli, input);

  if (isNil(command)) {
    // We don't have any match, so we can't even give auto-complete results.
    return {
      commandCompletions,
      flagCompletions,
    };
  }

  commandCompletions = await completionsDetermineCommandCompletions(
    command,
    input,
  );

  const availableFlags = cliParserGetKnownFlags(command);

  const flagsResult = await completionGetFlagCompletions(
    availableFlags,
    input,
    {
      forceFlagCompletions: !command?.modifiers.isCosmetic,
    },
  );

  if (flagsResult.shouldSkipCommands) {
    commandCompletions = [];
  }

  flagCompletions = flagsResult.flagCompletions;

  return {
    commandCompletions,
    flagCompletions,
  };
}

/**
 * @param {import("../../generated/common/types").CliCompletion[]} commandCompletions
 * @param {import("../../generated/common/types").CliCompletion[]} flagCompletions
 */
function completionsPrintForZsh(commandCompletions, flagCompletions) {
  let completionResult = `local commands\ncommands=(`;
  let postResult = ``;

  /**
   *
   * @param {import("../../generated/common/types").CliCompletion} completion
   */
  const addCompletion = (completion) => {
    // @ts-ignore
    const escapedDescription = completion?.description?.replaceAll(
      /(['"`])/g,
      (it) => `\\${it}`,
    );

    switch (completion.type) {
      case "directory":
        postResult += `\n_files -/`;
        break;
      case "file":
        postResult += `\n_files`;
        break;
      case "completion":
        completionResult += `"${completion.name}${
          completion.description ? `:${escapedDescription}` : ""
        }" `;
        break;
      case "value": {
        const options = {
          boolean: "true, false",
          number: "number",
          string: "string ",
          booleanOrString: "true, false or a string",
        };
        postResult += `\n_message -r 'Input: ${
          options[completion.specification]
        }${
          completion.description ? `\nDescription: ${escapedDescription}` : ""
        }'`;
        break;
      }
    }
  };

  for (const cmp of commandCompletions) {
    addCompletion(cmp);
  }

  for (const cmp of flagCompletions) {
    addCompletion(cmp);
  }

  let result = completionResult;
  if (result.endsWith("commands=(")) {
    result = "";
  } else {
    result += `)\n_describe 'values' commands`;
  }

  result += postResult;

  if (environment.COMPAS_DEBUG_COMPLETIONS === "true") {
    appendFileSync(
      "./compas-debug-completions.txt",
      `\n${new Date().toISOString()}\n${result}\n`,
    );
  }

  // eslint-disable-next-line no-console
  console.log(result);
}

/**
 * Match the command based on the input.
 * When an invalid match is encountered, we abort any matching.
 * If an invalid match is the last 'command' input like 'compas foo<tab>' we can return
 * all valid sub commands of 'compas <tab>'.
 *
 * @param {import("../../cli/types.js").CliResolved} cli
 * @param {string[]} input
 * @returns {import("../../cli/types.js").CliResolved|undefined|undefined}
 */
function completionsMatchCommand(cli, input) {
  let command = cli;
  const { commandArgs, flagArgs } = cliParserSplitArgs(input);

  // commandArgs[0] is always cli.name, so skip that match
  // If flags are passed, we expect that the command is fully correct, else we expect to
  // generate completions for the last commandArgs item.
  for (
    let i = 1;
    i < commandArgs.length - (flagArgs.length === 0 ? 1 : 0);
    ++i
  ) {
    const currentInput = commandArgs[i];

    const matchedCommand = command.subCommands.find(
      (it) => it.name === currentInput,
    );
    const dynamicCommand = command.subCommands.find(
      (it) => it.modifiers.isDynamic,
    );

    if (matchedCommand) {
      command = matchedCommand;
    } else if (dynamicCommand) {
      command = dynamicCommand;
    } else if (i !== commandArgs.length - 1) {
      // @ts-ignore
      command = undefined;
      break;
    }
  }

  return command;
}

/**
 * Add sub commands; but don't be too greedy;
 *  - We don't support flags in between commands, so if flags are found, skip sub
 * commands.
 *  - We don't support commands ending in 'isCosmetic' commands, so force sub commands
 *  - We expect commands to be strings containing only 'a-z' and dashes (-), so if not
 * it is a dynamic value or flag.
 *
 * @param {import("../types").CliResolved} command
 * @param {string[]} input
 * @returns {Promise<import("../../generated/common/types").CliCompletion[]>}
 */
async function completionsDetermineCommandCompletions(command, input) {
  /** @type {CliCompletion[]} */
  const completions = [];

  const { flagArgs } = cliParserSplitArgs(input);

  if (command?.modifiers.isCosmetic || flagArgs.length === 0) {
    for (const subCommand of command.subCommands) {
      if (subCommand.modifiers.isDynamic) {
        // Dynamic sub commands always have some form of completions defined, so
        // integrate those.
        completions.push(
          ...((await subCommand?.dynamicValue?.completions?.())?.completions ??
            []),
        );

        continue;
      }

      completions.push({
        type: "completion",
        name: subCommand.name,
        description: subCommand.shortDescription,
      });
    }
  }

  return completions;
}

/**
 *
 * @param {Map<string, import("../../generated/common/types").CliFlagDefinition>} availableFlags
 * @param {string[]} input
 * @param {{ forceFlagCompletions: boolean }} options
 * @returns {Promise<{
 *   shouldSkipCommands: boolean,
 *   flagCompletions: import("../../generated/common/types").CliCompletion[],
 * }>}
 */
async function completionGetFlagCompletions(availableFlags, input, options) {
  const { commandArgs, flagArgs } = cliParserSplitArgs(input);

  if (
    flagArgs.length === 0 &&
    commandArgs.at(-1) !== "-" &&
    !options.forceFlagCompletions
  ) {
    return { shouldSkipCommands: false, flagCompletions: [] };
  }

  availableFlags.delete("-h");

  const lastItem = flagArgs.at(-1);
  const oneToLastItem = flagArgs.at(-2);

  if (lastItem?.includes("=") && availableFlags.has(lastItem.split("=")[0])) {
    const [flagName] = lastItem.split("=");
    const definition = availableFlags.get(flagName);

    return {
      shouldSkipCommands: true,

      // @ts-ignore
      flagCompletions: (
        await definition?.value?.completions?.()
      )?.completions.map((it) => {
        if (it.type === "completion" && it.name) {
          it.name = `${flagName}=${it.name}`;
        }

        return it;
      }),
    };
  }

  /** @type {CliCompletion[]} */
  let oneToLastCompletions = [];
  if (availableFlags.has(oneToLastItem ?? "")) {
    oneToLastCompletions =
      (await availableFlags.get(oneToLastItem ?? "")?.value?.completions?.())
        ?.completions ?? [];
  }

  if (
    oneToLastCompletions.length > 0 &&
    !(
      oneToLastCompletions.length === 1 &&
      oneToLastCompletions[0].type === "value" &&
      ["boolean", "booleanOrString"].includes(
        oneToLastCompletions[0].specification,
      )
    )
  ) {
    return {
      shouldSkipCommands: true,
      flagCompletions: oneToLastCompletions,
    };
  }

  for (let i = 0; i < flagArgs.length - 1; ++i) {
    let value = flagArgs[i];

    if (value.includes("=")) {
      value = value.split("=")[0];
    }

    if (
      availableFlags.has(value) &&
      !availableFlags.get(value ?? "")?.modifiers.isRepeatable
    ) {
      availableFlags.delete(value);
    }
  }

  return {
    shouldSkipCommands: false,

    // @ts-ignore
    flagCompletions: [...availableFlags.keys()]
      .map((it) => ({
        type: "completion",
        name: it,
        description: availableFlags.get(it ?? "")?.description,
      }))
      .concat(
        // @ts-ignore
        oneToLastCompletions,
      ),
  };
}

/**
 *
 * @param {import("../../cli/types.js").CliResolved} cli
 */
function printCompletionScripts(cli) {
  // ZSH
  // eslint-disable-next-line no-console
  console.log(`#compdef ${cli.name}
###-begin-${cli.name}-completions-###
#
# Compas command completion script
#
# Installation: ${cli.name} completions >> ~/.zshrc
#    or ${cli.name} completions >> ~/.zsh_profile on OSX.
#
_${cli.name}_compas_completions()
{
  local args
  local si=$IFS
  
  IFS=$'\\t' 
  args=$words[*]
  IFS=$'\\n'
  COMP_CWORD="$((CURRENT-1))"
  COMP_LINE="$BUFFER"
  COMP_POINT="$CURSOR"
  
  eval "$(${cli.name} completions --get-completions "$args")"
  
  IFS=$si
}
compdef _${cli.name}_compas_completions ${cli.name}
###-end-${cli.name}-completions-###
`);
}

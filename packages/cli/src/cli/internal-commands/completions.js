import { writeFile } from "fs/promises";
import { environment, isNil } from "@compas/stdlib";
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
  executor: cliExecutor,
};

/**
 * From Yargs:
 * https://github.com/yargs/yargs/blob/30edd5067111b2b59387dcc47f4e7af93b9054f3/LICENSE
 * https://github.com/yargs/yargs/blob/30edd5067111b2b59387dcc47f4e7af93b9054f3/lib/completion.ts
 * https://github.com/yargs/yargs/blob/30edd5067111b2b59387dcc47f4e7af93b9054f3/lib/completion-templates.ts
 *
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

  if (isNil(state.flags.getCompletions)) {
    // TODO: Disable JSON logger?
    printCompletionScripts(state.cli, { isZSH });
    return {
      exitStatus: "passed",
    };
  }

  let inputCommand = state.flags.getCompletions;
  if (inputCommand === true) {
    inputCommand = state.cli.name;
  }

  // We use \t as the seperator when passing the current command to be auto-completed to
  // '--get-completions'
  /** @type {string[]} */
  // @ts-ignore
  inputCommand = inputCommand.split("\t");

  // We can reuse the split args function
  // @ts-ignore
  const { commandArgs, flagArgs } = cliParserSplitArgs(inputCommand);

  const matchedCommand = completionsMatchCommand(state.cli, commandArgs);
  if (isNil(matchedCommand)) {
    // No match, so early return without any auto complete options.
    return {
      exitStatus: "passed",
    };
  }

  const availableFlags = cliParserGetKnownFlags(matchedCommand);

  /** @type {{ name: string ,description?: string }[] } */
  const completions = [];

  // Add sub commands; but don't be to greedy;
  //  - We don't support flags in between commands, so if flags are found, skip sub
  // commands.
  //  - We don't support commands ending in 'isCosmetic' commands, so force sub commands
  //  - We expect commands to be strings containing only 'a-z' and dashes (-), so if not it is a dynamic value or flag.
  if (
    matchedCommand?.modifiers.isCosmetic &&
    flagArgs.length === 0 &&
    /^[\w-]*$/g.test(commandArgs.at(-1))
  ) {
    for (const subCommand of matchedCommand.subCommands) {
      if (subCommand.modifiers.isDynamic) {
        // Dynamic sub commands always have some form of completions defined, so
        // integrate those.
        completions.push(
          ...(await subCommand.dynamicValue.completions()).completions,
        );

        continue;
      }

      completions.push({
        name: subCommand.name,
        description: subCommand.shortDescription,
      });
    }
  }

  const flagCompletions = await completionGetFlagCompletions(
    availableFlags,
    flagArgs,
    {
      forceFlagCompletions: !matchedCommand?.modifiers.isCosmetic,
    },
  );

  completions.push(...flagCompletions);

  if (environment.COMPAS_DEBUG_COMPLETIONS === "true") {
    await writeFile(
      "./compas-debug-completions.json",
      JSON.stringify(
        {
          completions,
        },
        null,
        2,
      ),
    );
  }

  if (isZSH) {
    completionsPrintForZsh(completions);
  } else {
    completionsPrintForBash(completions);
  }

  return {
    exitStatus: completions.length === 0 ? "failed" : "passed",
  };
}

/**
 * @param {{ name: string, description?: string }[]} completions
 */
function completionsPrintForZsh(completions) {
  for (const cmp of completions) {
    // eslint-disable-next-line no-console
    console.log(`${cmp.name}${cmp.description ? `:${cmp.description}` : ""}`);
  }
}

/**
 * @param {{ name: string, description?: string }[]} completions
 */
function completionsPrintForBash(completions) {
  for (const cmp of completions) {
    // eslint-disable-next-line no-console
    console.log(`${cmp.name}`);
  }
}

/**
 * Match the command based on the input.
 * When an invalid match is encountered, we abort any matching.
 * If an invalid match is the last 'command' input like 'compas foo<tab>' we can return
 * all valid sub commands of 'compas <tab>'.
 *
 * @param {import("../../cli/types.js").CliResolved} cli
 * @param {string[]} input
 * @returns {import("../../cli/types.js").CliResolved|undefined}
 */
function completionsMatchCommand(cli, input) {
  let cmd = cli;

  for (let i = 1; i < input.length - 1; ++i) {
    const currentInput = input[i];

    const matchedCommand = cmd.subCommands.find(
      (it) => it.name === currentInput,
    );
    const dynamicCommand = cmd.subCommands.find((it) => it.modifiers.isDynamic);

    if (matchedCommand) {
      cmd = matchedCommand;
    } else if (dynamicCommand) {
      cmd = dynamicCommand;
    } else {
      return undefined;
    }
  }

  return cmd;
}

/**
 *
 * @param {Map<string, import("../../generated/common/types").CliFlagDefinition>} availableFlags
 * @param {string[]} flagArgs
 * @param {{ forceFlagCompletions: boolean }} options
 * @returns {Promise<{ name: string, description?: string }[]>}
 */
async function completionGetFlagCompletions(availableFlags, flagArgs, options) {
  if (flagArgs.length === 0 && !options.forceFlagCompletions) {
    return [];
  }

  availableFlags.delete("-h");

  const lastItem = flagArgs.at(-1);
  const oneToLastItem = flagArgs.at(-2);

  if (lastItem?.includes("=") && availableFlags.has(lastItem.split("=")[0])) {
    const [flagName] = lastItem.split("=");
    const definition = availableFlags.get(flagName);

    return (await definition.value.completions()).completions.map((it) => {
      return {
        name: `${flagName}=${it.name}`,
        description: it.description,
      };
    });
  }

  let oneToLastCompletions = [];
  if (availableFlags.has(oneToLastItem)) {
    oneToLastCompletions = (
      await availableFlags.get(oneToLastItem).value.completions()
    ).completions;
  }

  for (let i = 0; i < flagArgs.length - 1; ++i) {
    let value = flagArgs[i];

    if (value.includes("=")) {
      value = value.split("=")[0];
    }

    if (
      availableFlags.has(value) &&
      !availableFlags.get(value).modifiers.isRepeatable
    ) {
      availableFlags.delete(value);
    }
  }

  return [...availableFlags.keys()]
    .map((it) => ({
      name: it,
      description: availableFlags.get(it).description,
    }))
    .concat(oneToLastCompletions);
}

/**
 *
 * @param {import("../../cli/types.js").CliResolved} cli
 * @param {{ isZSH: boolean }} options
 */
function printCompletionScripts(cli, { isZSH }) {
  if (!isZSH) {
    // Bash
    // eslint-disable-next-line no-console
    console.log(`
###-begin-${cli.name}-completions-###
#
# Compas command completion script
#
# Installation: ${cli.name} completions >> ~/.bashrc
#    or ${cli.name} completions >> ~/.bash_profile on OSX.
#
_${cli.name}_compas_completions()
{
    local cur_word args type_list
    cur_word="\${COMP_WORDS[COMP_CWORD]}"
    args=("\${COMP_WORDS[@]}")
    # ask ${cli.name} to generate completions via a Compas internal flag.
    type_list=$(${cli.name} completions --get-completions "\${args[@]}")
    COMPREPLY=( $(compgen -W "\${type_list}" -- \${cur_word}) )
    # if no match was found, fall back to filename completion
    if [ \${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi
    return 0
}
complete -o bashdefault -o default -F _${cli.name}_compas_completions ${cli.name}
###-end-${cli.name}-completions-###
`);
    return;
  }

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
  local reply
  local args
  local si=$IFS
  IFS=$'\\t' 
  args=$words[*]
  IFS=$'\\n' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" ${cli.name} completions --get-completions "$args"))
  IFS=$si
  _describe 'values' reply
}
compdef _${cli.name}_compas_completions ${cli.name}
###-end-${cli.name}-completions-###
`);
}

# Extending the CLI

It is possible to extend the Compas CLI in projects with custom commands. Giving
your collaborators the power to do tasks with a consistent experience of
discovery and error handling.

## Locations

The Compas CLI checks two places for extra commands: the `compas` config file,
and the top level `scripts` directory.

Files in the `scripts` directory can export a cli definition and be upgraded
from `compas run $name --script-args "--arg 1` to `compas $name --arg 1`. This
is advisable to do for any script requiring arguments to be passed. Making it
consistent to document, but also validate these values.

The `config/compas.{js,json}` is loaded by the
[config loader](/features/config-files.html#config-loader). And expects the
following config object:

```json
{
  "cli": {
    "commandDirectories": [
      "./directory/relative/to/project/root",
      "./and/another"
    ]
  }
}
```

All files in the specified directories should also export a cli definition
object to be loaded.

## CLI Definition

```js
// Export a cliDefinition to be seen as a command.
/** @type {import("@compas/cli").CliCommandDefinitionInput} */
export const cliDefinition = {
  // `compas todo`
  // requireed
  name: "todo",

  // Description that is printed in line in the command list
  // required
  shortDescription: "Manage todo items",

  // Used for `compas todo --help` or `compas help todo`
  longDescription: "",

  // Optional object
  modifiers: {
    // Prints the command help output if no sub command is passed.
    // Defaults to false
    isCosmetic: true,

    // When set to true, instead of matching on the name any value can be passed, i.e `compas run generate`, `compas run foo`.
    // Defaults to false.
    isDynamic: false,
  },

  // Optional flag array. Sub commands also allow the flags defined by their parents.
  flags: [
    {
      // This name is used to store the value
      // required
      name: "namespace",

      // The flag name, requires to be prefixed with `--`
      // requirered
      rawName: "--namespace",

      // Description to show in help output.
      description: "Only return todo's in this namespace",

      // Optional modifiers object
      modifiers: {
        // Make this flag required.
        isRequired: false

        // This flag can be repeated, resulting in an array that is passed to the executor.
        isRepeatable: false
      },

      // Optional value specification
      value: {
        // Give a type to the value that can be passed. The parser also does the conversion.
        // "boolean" (default): accepts no value, 'true', '1', 'false' and '0'.
        // "number" accepts any value that converts to a number
        // "string" Accept any value.
        // "booleanOrString" A combination of "boolean" and "string", giving the "boolean" parser precedence.
        specification: "string",

        // Optional validator, can return a Promise.
        // This example checks if the flag value is a path.
        validator: (value) => {
          const isValid = existsSync(value);

          if (isValid) {
            return {
              isValid,
            };
          }

          return {
            isValid, error: {
              message: `Could not find the specified file relative to the current working directory. Make sure it exists.`,
            },
          };
        },
      },
    },
  ],

  // Optional sub commands, this is required if this command is `modifiers.isCosmetic`.
  subCommands: [
    // Minimal command definition
    {
      name: "list", shortDescription: "List all todo's."
    }
  ],

  // An optional executor. If a command does not have an executor, the executor of it's (recursive) parent is used.
  executor: cliExecutor,

  // Validate the value if this command is dynamic (`modifiers.isDynamic').
  // Can return a Promise.
  dynamicValidator: (value) => {
    const isValid = [ "toggle", "add" ].includes(value);

    if (isValid) {
      return {
        isValid,
      }
    }

    // Full error message: "Invalid sub command 'xxx' for 'compas todo'. Allowed values are 'toggle' and 'add'.
    return {
      isValid, error: {
        message: "Allowed values are 'toggle' and 'add'.",
      }
    }
  }
};

/**
 * Is called when this command or a sub command is matched.
 *
 * @param {import("@compas/stdlib").Logger} logger
 * @param {import("@compas/cli").CliExecutorState} state
 * @returns {Promise<import("@compas/cli").CliResult>}
 */
async function cliExecutor(logger, state) {
  logger.info(state.command);
  logger.info(state.flags);

  return {
    exitStatus: "passed",
  }
}
```

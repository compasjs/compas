import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { isNil, spawn } from "@compas/stdlib";
import { collectScripts } from "../../utils.js";

/**
 * @type {import("../../generated/common/types.js").CliCommandDefinitionInput}
 */
export const cliDefinition = {
  name: "run",
  shortDescription:
    "Run arbitrary JavaScript files, scripts defined in the package.json and scripts located in the scripts directory.",
  modifiers: {
    isCosmetic: true,
  },
  subCommands: [
    {
      name: "script",
      modifiers: {
        isDynamic: true,
        isWatchable: true,
      },
      dynamicValue: {
        validator: (value) => {
          const scriptCollection = collectScripts();
          const isValid =
            !isNil(scriptCollection[value]) ||
            (existsSync(value) && statSync(value).isFile());

          if (isValid) {
            return {
              isValid,
            };
          }

          return {
            isValid,
            error: {
              message: `Can run files from the following places:
- Files located in the 'scripts' directory.
- Scripts defined in the package.json
- Any path to a file, that can be executed via 'node [$--node-args] $file'

Scripts directory:
${Object.entries(scriptCollection)
  .filter(([, value]) => value.type === "user")
  .map(([key]) => `  - ${key}`)
  .join("\n")}

Package.json scripts:
${Object.entries(scriptCollection)
  .filter(([, value]) => value.type === "package")
  .map(([key]) => `  - ${key}`)
  .join("\n")}
`,
            },
          };
        },

        /**
         * @returns {{completions: Array<import("../../generated/common/types.js").CliCompletion>}}
         */
        completions: () => {
          const scriptCollection = collectScripts();

          return {
            completions: [
              {
                type: "file",
              }, // @ts-ignore
              ...Object.keys(scriptCollection).map((it) => {
                const value = scriptCollection[it];

                if (value.type === "package") {
                  return {
                    type: "completion",
                    name: it,
                    description: `The '${it}' script from the package.json.`,
                  };
                }

                return {
                  type: "completion",
                  name: it,
                  description: `The '${it}' script defined in ./scripts.`,
                };
              }),
            ],
          };
        },
      },
      shortDescription: "The file or script to run.",
    },
  ],
  flags: [
    {
      name: "scriptArguments",
      rawName: "--script-args",
      description:
        "Arguments passed as is to the script when executed (like '--port 3000').",
      value: {
        specification: "string",
      },
    },
    {
      name: "nodeArguments",
      rawName: "--node-args",
      description:
        "Arguments passed to Node when executing the script (like '--inspect').",
      value: {
        specification: "string",
      },
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
  // TODO: Remove scripts that export a `cliDefinition`.

  const scriptCollection = collectScripts();
  const scriptName = state.command.at(-1);
  // @ts-ignore
  const script = scriptCollection[scriptName];

  let cmd;
  const args = [];

  if (script && script.type === "package") {
    // TODO determine npm vs yarn

    cmd = existsSync("yarn.lock") ? "yarn" : "npm";
    args.push("run", script.name);
    if (state.flags.scriptArguments) {
      // @ts-ignore
      args.push(...state.flags.scriptArguments.split(" "));
    }

    // @ts-ignore
    if (state.flags.nodeArguments?.length > 0) {
      logger.error(
        "Node arguments are not supported if the script is defined in the package.json",
      );
    }
  } else {
    // @ts-ignore
    const src = script ? script.path : path.resolve(scriptName);

    cmd = "node";
    if (state.flags.nodeArguments) {
      // @ts-ignore
      args.push(...state.flags.nodesArguments.split(" "));
    }

    args.push(src);

    if (state.flags.scriptArguments) {
      // @ts-ignore
      args.push(...state.flags.scriptArguments.split(" "));
    }
  }

  // Easy mode
  const { exitCode } = await spawn(cmd, args);

  return {
    exitStatus: exitCode === 0 ? "passed" : "failed",
  };
}

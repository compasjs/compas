import { TypeCreator } from "@compas/code-gen";

/**
 * @param generator
 */
export function applyCliStructure(generator) {
  const T = new TypeCreator("cli");

  // Note that if this is updated, both `compasGetCli` and `cliHelpInit` should be
  // updated. This is also a downstream breaking change.

  generator.add(
    T.anyOf("completion").values(
      { type: "directory" },
      {
        type: "file",
      },
      {
        type: "completion",
        name: T.string(),
        description: T.string().optional(),
      },
      {
        type: "value",
        specification: T.string().oneOf(
          "boolean",
          "number",
          "string",
          "booleanOrString",
        ),
        description: T.string().optional(),
      },
    ),

    T.object("flagDefinition").keys({
      name: T.string(),
      rawName: T.string().pattern(/^--\w/g).lowerCase(),
      description: T.string()
        .optional()
        .pattern(/^[^\n]+$/g),
      modifiers: T.object()
        .keys({
          isRepeatable: T.bool().default(false),
          isRequired: T.bool().default(false),
          isInternal: T.bool().default(false),
        })
        .default(
          JSON.stringify({
            isRepeatable: false,
            isRequired: false,
            isInternal: false,
          }),
        ),
      value: T.object()
        .keys({
          specification: T.string()
            .oneOf("boolean", "number", "string", "booleanOrString")
            .default(`"boolean"`),
          validator: T.any()
            .implementations({
              js: {
                validatorExpression: `typeof $value$ === "function"`,
                validatorInputType:
                  "((value: any) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>)",
                validatorOutputType:
                  "((value: any) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>)",
              },
            })
            .optional(),
          completions: T.any()
            .implementations({
              js: {
                validatorExpression: `typeof $value$ === "function"`,
                validatorInputType:
                  "(() => Promise<{ completions: CliCompletion[] }>|{ completions: CliCompletion[] })",
                validatorOutputType:
                  "(() => Promise<{ completions: CliCompletion[] }>|{ completions: CliCompletion[] })",
              },
            })
            .optional(),
        })
        .default(
          JSON.stringify({
            specification: "boolean",
          }),
        ),
    }),

    T.object("commandDefinition").keys({
      name: T.string().pattern(/^[a-z-]+$/g),
      shortDescription: T.string().pattern(/^[^\n]+$/g),
      longDescription: T.string().optional(),
      modifiers: T.object()
        .keys({
          isDynamic: T.bool().default(false),
          isCosmetic: T.bool().default(false),
          isWatchable: T.bool().default(false),
        })
        .default(
          JSON.stringify({
            isDynamic: false,
            isCosmetic: false,
            isWatchable: false,
          }),
        ),
      dynamicValue: T.object()
        .keys({
          validator: T.any()
            .implementations({
              js: {
                validatorExpression: `typeof $value$ === "function"`,
                validatorInputType:
                  "((value: string) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>)",
                validatorOutputType:
                  "((value: string) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>)",
              },
            })
            .optional(),
          completions: T.any()
            .implementations({
              js: {
                validatorExpression: `typeof $value$ === "function"`,
                validatorInputType:
                  "(() => Promise<{ completions: CliCompletion[] }>|{ completions: CliCompletion[] })",
                validatorOutputType:
                  "(() => Promise<{ completions: CliCompletion[] }>|{ completions: CliCompletion[] })",
              },
            })

            .optional(),
        })
        .default("{}"),
      watchSettings: T.object()
        .keys({
          extensions: T.array().values(T.string()).default(`["js", "json"]`),
          ignorePatterns: T.array()
            .values(T.string())
            .default(`[".cache", "coverage", "node_modules"]`),
        })
        .default(
          JSON.stringify({
            extensions: ["js", "json"],
            ignorePatterns: [".cache", "coverage", "node_modules"],
          }),
        ),
      subCommands: T.array()
        .values(T.reference("cli", "commandDefinition"))
        .default("[]"),
      flags: T.array()
        .values(T.reference("cli", "flagDefinition"))
        .default("[]"),
      executor: T.any()
        .implementations({
          js: {
            validatorExpression: `typeof $value$ === "function"`,
            validatorInputType: `((logger: import("@compas/stdlib").Logger, state: import("../../cli/types").CliExecutorState) => (Promise<import("../../cli/types").CliResult>|CliResult))`,
            validatorOutputType: `((logger: import("@compas/stdlib").Logger, state: import("../../cli/types").CliExecutorState) => (Promise<import("../../cli/types").CliResult>|CliResult))`,
          },
        })
        .optional(),
    }),
  );
}

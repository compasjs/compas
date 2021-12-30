import { TypeCreator } from "@compas/code-gen";

/**
 * @param app
 */
export function applyCliStructure(app) {
  const T = new TypeCreator("cli");

  app.add(
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
        })
        .default(
          JSON.stringify({
            isRepeatable: false,
            isRequired: false,
          }),
        ),
      value: T.object()
        .keys({
          specification: T.string()
            .oneOf("boolean", "number", "string", "booleanOrString")
            .default(`"boolean"`),
          validator: T.any()
            .raw(
              "((value: any) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>)",
            )
            .validator(`((v) => typeof v === "function")`)
            .optional(),
        })
        .default(
          JSON.stringify({
            specification: "boolean",
          }),
        ),
    }),

    T.object("commandDefinition").keys({
      name: T.string(),
      shortDescription: T.string().pattern(/^[^\n]+$/g),
      longDescription: T.string().optional(),
      modifiers: T.object()
        .keys({
          isDynamic: T.bool().default(false),
          isCosmetic: T.bool().default(false),
        })
        .default(
          JSON.stringify({
            isDynamic: false,
            isCosmetic: false,
          }),
        ),
      dynamicValidator: T.any()
        .raw(
          "((value: string) => { isValid: boolean, error?: { message: string }}|Promise<{ isValid: boolean, error?: { message: string }}>)",
        )
        .validator(`((v) => typeof v === "function")`)
        .optional(),
      subCommands: T.array()
        .values(T.reference("cli", "commandDefinition"))
        .default("[]"),
      flags: T.array()
        .values(T.reference("cli", "flagDefinition"))
        .default("[]"),
      executor: T.any()
        .raw(
          `((logger: import("@compas/stdlib").Logger, state: import("../../cli/types").CliExecutorState) => (Promise<import("../../cli/types").CliResult>|CliResult))`,
        )
        .validator(`((v) => typeof v === "function")`)
        .optional(),
    }),
  );
}

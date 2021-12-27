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
      valueSpecification: T.string()
        .oneOf("boolean", "number", "string", "booleanOrString")
        .default(`"boolean"`),
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
      subCommands: T.array()
        .values(T.reference("cli", "commandDefinition"))
        .default("[]"),
      flags: T.array()
        .values(T.reference("cli", "flagDefinition"))
        .default("[]"),
    }),
  );
}

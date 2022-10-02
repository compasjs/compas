import { TypeCreator } from "@compas/code-gen";

/**
 * Structure for types that are user input.
 *
 * @param {App} app
 */
export function extendWithCodeGenExperimental(app) {
  const T = new TypeCreator("experimental");

  const namePart = T.string("namePart")
    .min(1)
    .pattern(/^[a-zA-Z$][a-zA-Z\d]+$/g);

  const typeDefinitionBase = {
    docString: T.string().min(0),
    isOptional: T.bool(),
    defaultValue: T.anyOf()
      .values(T.string().min(1), T.bool(), T.number())
      .optional(),
    sql: T.object()
      .keys({
        primary: T.bool().optional(),
        searchable: T.bool().optional(),
        hasDefaultValue: T.bool().optional(),
      })
      .loose(),
    validator: T.object().loose(),
  };

  const namedTypeDefinitionBase = {
    group: T.string().optional(),
    name: T.string().optional(),
    ...typeDefinitionBase,
  };

  app.add(
    T.generic("structure")
      .keys(namePart)
      .values(
        T.generic()
          .keys(namePart)
          .values(T.reference("experimental", "namedTypeDefinition")),
      ),

    T.object("generateOptions")
      .keys({
        // TODO: Add link to docs with compatibility between language and runtime.
        targetLanguage: T.string().oneOf("js", "ts"),
        targetRuntime: T.string()
          .optional()
          .oneOf("node.js", "browser", "react-native")
          .docs(
            "Only applicable if your 'targetLanguage' is set to 'js' or 'ts'.",
          ),
        outputDirectory: T.string().optional(),

        // This will most likely be the only strictly validated object of the bunch.
        generators: {
          structure: T.object()
            .keys({})
            .optional()
            .docs(
              "Enable a structure dump. This way this structure can be reused vai 'Generator#addStructure",
            ),
          openApi: T.object()
            .keys({
              openApiExtensions: T.any().optional(),
              openApiRouteExtensions: T.any().optional(),
            })
            .optional()
            .docs("Enable the OpenAPI generator."),
          router: T.object()
            .keys({
              // TODO: Add link to docs with compatibility between
              //  language and target library.
              targetLibrary: T.string()
                .oneOf("koa")
                .docs(
                  "Select one of the supported libraries to generate a router for.",
                ),
              exposeApiStructure: T.bool()
                .default(false)
                .docs(
                  "Adds a Compas '_compas/structure.json' route to the generated router that includes all available routes.",
                ),
            })
            .optional()
            .docs(
              "Generate a validating router with entry points for your route handlers.",
            ),
          database: T.object()
            .keys({
              // TODO: Add link to docs with compatibility between
              //  language and target dialect / target library.
              targetDialect: T.string()
                .oneOf("postgresql")
                .docs(
                  "Select one of the supported dialects to generate queries for.",
                ),
            })
            .optional()
            .docs("Generate one of the compatible database interfaces."),
          validators: T.object()
            .keys({
              includeBaseTypes: T.bool()
                .default(false)
                .docs(
                  "Always generate validators for all named types even if no other generator needs it.",
                ),
            })
            .optional()
            .docs(
              "Alter the output of generated validators. Other generators will always include validators in their output if necessary.",
            ),
          apiClient: T.object()
            .keys({
              // TODO: Add link to docs with compatibility between
              //  language and target library.
              targetLibrary: T.string()
                .oneOf("axios")
                .docs("Select your HTTP client of choice."),
              validateResponses: T.bool()
                .default(false)
                .docs(
                  "Include validators that check the responses. This way you can be sure that the API returns what you expect.",
                ),
              globalClient: T.bool()
                .default(false)
                .docs(
                  "Use a global api client that will be used for all requests. Only applicable when using 'axios'.",
                ),

              // TODO: Add link to docs with compatibility between
              //  language and target library.
              includeWrapper: T.string()
                .oneOf("react-query")
                .optional()
                .docs(
                  "Include an API client wrapper to use the api easier with your user interface library.",
                ),
            })
            .optional()
            .docs(
              "Generate an API client, based on the routes in your structure.",
            ),
          types: T.object()
            .keys({
              useGlobalTypes: T.bool()
                .default(false)
                .docs(
                  "Declare all types in the global namespace. Only applicable when using 'targetLanguage' when set to 'js' or 'ts'.",
                ),
              useGlobalCompasTypes: T.bool()
                .default(false)
                .docs(
                  "Creates global types for types provided by Compas features. Only applicable when using 'targetLanguage' that is set to 'js' or 'ts'.",
                ),
              generateDeduplicatedTypes: T.bool()
                .default(false)
                .docs(
                  "Combine all types based that would be generated by all structures added via 'Generator#addStructure' and combine them in to a single output.",
                ),
              useDeduplicatedTypesPath: T.string()
                .optional()
                .docs(
                  "Import deduplicated types from the provided path. This should set to the same value as the 'outputDirectory' in the generate call with 'generateDeduplicatedTypes'.",
                ),
            })
            .optional()
            .docs("Alter the output of the generated types."),
        },
      })
      .loose(),

    // NOTE:
    // These types shouldn't use defaults, since we shouldn't alter the input structure.
    // These defaults should be applied in the builders or later on in some processor.

    T.anyOf("namedTypeDefinition").values(
      T.reference("experimental", "anyDefinition"),
      T.reference("experimental", "anyOfDefinition"),
      T.reference("experimental", "arrayDefinition"),
      T.reference("experimental", "booleanDefinition"),
      T.reference("experimental", "dateDefinition"),
      T.reference("experimental", "numberDefinition"),
      T.reference("experimental", "objectDefinition"),
      T.reference("experimental", "stringDefinition"),
      T.reference("experimental", "uuidDefinition"),
    ),

    T.anyOf("typeDefinition").values(
      T.reference("experimental", "namedTypeDefinition"),
      T.reference("experimental", "referenceDefinition"),
    ),

    T.object("anyDefinition")
      .keys({
        type: "any",
        ...namedTypeDefinitionBase,
        validator: T.object()
          .keys({
            allowNull: T.bool(),
          })
          .loose(),

        // TODO: align with new targetLanguage & runtime setup.
        rawValue: T.string().optional(),
        rawValueImport: T.object()
          .keys({
            javaScript: T.string().optional(),
            typeScript: T.string().optional(),
          })
          .loose(),
        rawValidator: T.string().optional(),
        rawValidatorImport: T.object()
          .keys({
            javaScript: T.string().optional(),
            typeScript: T.string().optional(),
          })
          .loose(),
      })
      .loose(),

    T.object("anyOfDefinition")
      .keys({
        type: "anyOf",
        ...namedTypeDefinitionBase,
        values: T.array()
          .min(1)
          .values(T.reference("experimental", "typeDefinition")),
      })
      .loose(),

    T.object("arrayDefinition")
      .keys({
        type: "array",
        ...namedTypeDefinitionBase,
        values: T.reference("experimental", "typeDefinition"),
        validator: T.object()
          .keys({
            convert: T.bool(),
            min: T.number().optional(),
            max: T.number().optional(),
          })
          .loose(),
      })
      .loose(),

    T.object("booleanDefinition")
      .keys({
        type: "boolean",
        ...namedTypeDefinitionBase,
        oneOf: T.bool().optional(),
        validator: T.object()
          .keys({
            convert: T.bool(),
            allowNull: T.bool(),
          })
          .loose(),
      })
      .loose(),

    T.object("dateDefinition")
      .keys({
        type: "date",
        ...namedTypeDefinitionBase,
        specifier: T.string().oneOf("dateOnly", "timeOnly").optional(),
        validator: T.object()
          .keys({
            allowNull: T.bool(),
            min: T.date().optional(),
            max: T.date().optional(),
            inFuture: T.bool().optional(),
            inPast: T.bool().optional(),
          })
          .loose(),
      })
      .loose(),

    T.object("numberDefinition")
      .keys({
        type: "number",
        ...namedTypeDefinitionBase,
        oneOf: T.array().values(T.number()).optional(),
        validator: T.object()
          .keys({
            convert: T.bool(),
            floatingPoint: T.bool(),
            min: T.number().optional(),
            max: T.number().optional(),
            allowNull: T.bool(),
          })
          .loose(),
      })
      .loose(),

    T.object("objectDefinition")
      .keys({
        type: "object",
        ...namedTypeDefinitionBase,
        shortName: T.string().optional(),
        validator: T.object()
          .keys({
            allowNull: T.bool(),
            strict: T.bool(),
          })
          .loose(),
        keys: T.generic()
          .keys(T.string())
          .values(T.reference("experimental", "typeDefinition")),
        enableQueries: T.bool().optional(),
        queryOptions: T.object()
          .keys({
            withSoftDeletes: T.bool().optional(),
            withDates: T.bool().optional(),
            withPrimaryKey: T.bool(),
            isView: T.bool().optional(),
            schema: T.string().optional(),
          })
          .optional()
          .loose(),

        // TODO: Simplify to relation type only
        relations: T.array().values(
          T.reference("experimental", "typeDefinition"),
        ),
      })
      .loose(),

    T.object("referenceDefinition")
      .keys({
        type: "reference",
        ...typeDefinitionBase,
        reference: T.object()
          .keys({
            group: namePart,
            name: namePart,
          })
          .loose(),
      })
      .loose(),

    T.object("stringDefinition")
      .keys({
        type: "string",
        ...namedTypeDefinitionBase,
        oneOf: T.array().values(T.string()).optional(),
        validator: T.object()
          .keys({
            convert: T.bool(),
            trim: T.bool(),
            lowerCase: T.bool(),
            upperCase: T.bool(),
            min: T.number().default(1),
            max: T.number().optional(),
            pattern: T.string().optional(),
            allowNull: T.bool(),
            disallowedCharacters: T.optional()
              .value([T.string().min(1).max(2)])
              .optional(),
          })
          .loose(),
      })
      .loose(),

    T.object("uuidDefinition")
      .keys({
        type: "uuid",
        ...namedTypeDefinitionBase,
        validator: T.object()
          .keys({
            allowNull: T.bool(),
          })
          .loose(),
      })
      .loose(),
  );
}

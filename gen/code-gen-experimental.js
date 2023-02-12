import { TypeCreator } from "@compas/code-gen";

/**
 * Structure for types that are user input.
 *
 * @param {import("@compas/code-gen/experimental").Generator} generator
 */
export function extendWithCodeGenExperimental(generator) {
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

  generator.add(
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

        outputDirectory: T.string().optional(),

        // This will most likely be the only strictly validated object of the bunch.
        generators: {
          structure: T.object()
            .keys({})
            .optional()
            .docs(
              "Enable a structure dump. This way this structure can be reused via 'Generator#addStructure",
            ),

          openApi: T.object()
            .keys({
              openApiExtensions: T.object()
                .keys({
                  version: T.string().optional(),
                  title: T.string().optional(),
                  description: T.string().optional(),
                })
                .default("{}")
                .docs("Custom top level properties."),
              openApiRouteExtensions: T.generic()
                .keys(T.string())
                .values(T.any())
                .default("{}")
                .docs(
                  "Add or overwrite specific properties per route. The keys should be formatted as 'upperCaseFirst(group) + upperCaseFirst(name)'.",
                ),
            })
            .optional()
            .docs("Enable the OpenAPI generator."),

          router: T.object()
            .keys({
              // TODO: Add link to docs with compatibility between
              //  language and target library.
              target: T.anyOf()
                .values({
                  library: "koa",
                })
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
              target: T.anyOf()
                .values({
                  dialect: "postgres",
                  includeDDL: T.bool()
                    .default(false)
                    .docs(
                      "Write out 'common/structure.sql' with a naive DDL approach.",
                    ),
                })
                .docs(
                  "Select one of the supported dialects to generate queries for.",
                ),

              includeEntityDiagram: T.bool()
                .default(false)
                .docs(
                  "Create a markdown file containing the ERD in a 'mermaid' block.",
                ),
            })
            .optional()
            .docs("Generate one of the compatible database interfaces."),

          validators: T.object()
            .keys({
              includeBaseTypes: T.bool()
                .default(false)
                .docs(
                  "Always generate validators for all named types even if no other generator needs it. This implies {@link ExperimentalGenerateOptions.generators.types.includeBaseTypes}.",
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
              target: T.anyOf()
                .values({
                  library: "axios",
                  targetRuntime: T.string().oneOf(
                    "node.js",
                    "browser",
                    "react-native",
                  ),

                  // TODO: Add link to docs with
                  //  compatibility between  language
                  //  and target library.
                  includeWrapper: T.string()
                    .oneOf("react-query")
                    .optional()
                    .docs(
                      "Include an API client wrapper to use the api easier with your user interface library.",
                    ),

                  globalClient: T.bool()
                    .default(false)
                    .docs(
                      "Use a global api client that will be used for all requests. Only applicable when using 'axios'.",
                    ),
                })
                .docs("Select your HTTP client of choice."),
            })
            .optional()
            .docs(
              "Generate an API client, based on the routes in your structure.",
            ),

          types: T.object()
            .keys({
              includeBaseTypes: T.bool()
                .default(false)
                .docs(
                  "Always generate types for all named types even if no other generator needs it.",
                ),

              declareGlobalTypes: T.bool()
                .default(false)
                .docs(
                  "Declare all types in the global namespace. Only applicable when using 'targetLanguage' when set to 'js' or 'ts'.",
                ),

              declareGlobalCompasTypes: T.bool()
                .default(false)
                .docs(
                  "Creates global types for types provided by Compas features. Only applicable when using 'targetLanguage' that is set to 'js' or 'ts'.",
                ),
            })
            .optional()
            .docs(
              "Alter the output of the generated types, they are always generated as a result of other enabled generators.",
            ),
        },
      })
      .loose(),

    // NOTE:
    // These types shouldn't use defaults, since we shouldn't alter the input structure.
    // These defaults should be applied in the builders or later on in some processor.

    T.anyOf("namedTypeDefinition")
      .docs(
        "This contains all types that can be added top level to the structure.",
      )
      .values(
        T.reference("experimental", "anyDefinition"),
        T.reference("experimental", "anyOfDefinition"),
        T.reference("experimental", "arrayDefinition"),
        T.reference("experimental", "booleanDefinition"),
        T.reference("experimental", "crudDefinition"),
        T.reference("experimental", "dateDefinition"),
        T.reference("experimental", "extendDefinition"),
        T.reference("experimental", "fileDefinition"),
        T.reference("experimental", "genericDefinition"),
        T.reference("experimental", "numberDefinition"),
        T.reference("experimental", "objectDefinition"),
        T.reference("experimental", "omitDefinition"),
        T.reference("experimental", "pickDefinition"),
        T.reference("experimental", "routeDefinition"),
        T.reference("experimental", "stringDefinition"),
        T.reference("experimental", "uuidDefinition"),
      ),

    T.anyOf("typeDefinition")
      .docs("This contains all known type definitions.")
      .values(
        T.reference("experimental", "namedTypeDefinition"),
        T.reference("experimental", "referenceDefinition"),
        T.reference("experimental", "relationDefinition"),
        T.reference("experimental", "routeInvalidationDefinition"),
      ),

    T.anyOf("typeSystemDefinition")
      .docs(
        "All type definitions that can be used inside other types, like object keys.",
      )
      .values(
        T.reference("experimental", "anyDefinition"),
        T.reference("experimental", "anyOfDefinition"),
        T.reference("experimental", "arrayDefinition"),
        T.reference("experimental", "booleanDefinition"),
        T.reference("experimental", "crudDefinition"),
        T.reference("experimental", "dateDefinition"),
        T.reference("experimental", "extendDefinition"),
        T.reference("experimental", "fileDefinition"),
        T.reference("experimental", "genericDefinition"),
        T.reference("experimental", "numberDefinition"),
        T.reference("experimental", "objectDefinition"),
        T.reference("experimental", "omitDefinition"),
        T.reference("experimental", "pickDefinition"),
        T.reference("experimental", "referenceDefinition"),
        T.reference("experimental", "stringDefinition"),
        T.reference("experimental", "uuidDefinition"),
      ),

    T.object("anyDefinition")
      .keys({
        type: "any",
        ...namedTypeDefinitionBase,
        targets: T.generic()
          .keys(
            T.string("anyDefinitionTarget").oneOf(
              "js",
              "ts",
              "jsKoaReceive",
              "jsKoaSend",
              "jsPostgres",
              "jsAxios",
              "tsAxios",
              "jsAxiosNode",
              "tsAxiosBrowser",
              "tsAxiosReactNative",
            ),
          )
          .values({
            validatorInputType: T.string(),
            validatorOutputType: T.string(),
            validatorExpression: T.string()
              .optional()
              .docs(
                `Expression that synchronously resolves to a boolean. Should be 'true' if the input is valid, and 'false' otherwise. Interpolates '$value$' with the current property that is being validated`,
              ),
            validatorImport: T.string()
              .optional()
              .docs(
                "A raw import that is added to the files where the provided validator expression is used.",
              ),
          })
          .docs(
            "Support different 'any' behaviours for different targets. All targets are optional and will be tried from most specific to least specific.",
          )
          .optional(),
        validator: T.object()
          .keys({
            allowNull: T.bool(),
          })
          .loose(),

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
          .values(T.reference("experimental", "typeSystemDefinition")),
      })
      .loose(),

    T.object("arrayDefinition")
      .keys({
        type: "array",
        ...namedTypeDefinitionBase,
        values: T.reference("experimental", "typeSystemDefinition"),
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

    T.object("crudDefinition")
      .keys({
        type: "crud",
        ...namedTypeDefinitionBase,
        basePath: T.string().optional(),
        entity: T.reference("experimental", "referenceDefinition").optional(),
        fromParent: T.object()
          .keys({
            field: T.string(),
            options: T.object()
              .keys({
                name: T.string().optional(),
              })
              .optional()
              .loose(),
          })
          .optional()
          .loose(),
        routeOptions: T.object()
          .keys({
            listRoute: T.bool().optional(),
            singleRoute: T.bool().optional(),
            createRoute: T.bool().optional(),
            updateRoute: T.bool().optional(),
            deleteRoute: T.bool().optional(),
          })
          .loose(),
        fieldOptions: T.object()
          .keys({
            readable: T.object()
              .keys({
                $omit: T.array().values(T.string()).optional(),
                $pick: T.array().values(T.string()).optional(),
              })
              .loose()
              .optional(),
            writable: T.object()
              .keys({
                $omit: T.array().values(T.string()).optional(),
                $pick: T.array().values(T.string()).optional(),
              })
              .loose()
              .optional(),
          })
          .loose(),
        inlineRelations: [T.reference("experimental", "crudDefinition")],
        nestedRelations: [T.reference("experimental", "crudDefinition")],
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

    T.object("extendDefinition")
      .keys({
        type: "extend",
        ...namedTypeDefinitionBase,
        keys: T.generic()
          .keys(T.string())
          .values(T.reference("experimental", "typeSystemDefinition")),
        reference: T.reference("experimental", "referenceDefinition"),
        relations: T.array().values(
          T.reference("experimental", "relationDefinition"),
        ),
      })
      .loose(),

    T.object("fileDefinition")
      .keys({
        type: "file",
        ...namedTypeDefinitionBase,
        validator: T.object()
          .keys({
            mimeTypes: T.array().values(T.string()).optional(),
          })
          .loose(),
      })
      .loose(),

    T.object("genericDefinition")
      .keys({
        type: "generic",
        ...namedTypeDefinitionBase,
        keys: T.reference("experimental", "typeSystemDefinition"),
        values: T.reference("experimental", "typeSystemDefinition"),
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
          .values(T.reference("experimental", "typeSystemDefinition")),
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
        relations: T.array().values(
          T.reference("experimental", "relationDefinition"),
        ),
      })
      .loose(),

    T.object("omitDefinition")
      .keys({
        type: "omit",
        ...namedTypeDefinitionBase,
        validator: T.object()
          .keys({
            allowNull: T.bool(),
            strict: T.bool(),
          })
          .loose(),
        keys: [T.string()],
        reference: T.reference("experimental", "typeSystemDefinition"),
      })
      .loose(),

    T.object("pickDefinition")
      .keys({
        type: "pick",
        ...namedTypeDefinitionBase,
        validator: T.object()
          .keys({
            allowNull: T.bool(),
            strict: T.bool(),
          })
          .loose(),
        keys: [T.string()],
        reference: T.reference("experimental", "typeSystemDefinition"),
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

    T.object("relationDefinition")
      .keys({
        type: "relation",
        subType: T.string().oneOf(
          "manyToOne",
          "oneToMany",
          "oneToOne",
          "oneToOneReverse",
        ),
        reference: T.reference("experimental", "referenceDefinition"),
        ownKey: T.string(),
        referencedKey: T.string().optional(),
        isOptional: T.bool(),
      })
      .loose(),

    T.object("routeDefinition")
      .keys({
        type: "route",
        ...namedTypeDefinitionBase,
        method: T.string().oneOf(
          "GET",
          "POST",
          "PUT",
          "DELETE",
          "HEAD",
          "PATCH",
        ),
        idempotent: T.bool(),
        path: T.string(),
        tags: [T.string()],
        query: T.reference("experimental", "referenceDefinition").optional(),
        params: T.reference("experimental", "referenceDefinition").optional(),
        body: T.reference("experimental", "referenceDefinition").optional(),
        files: T.reference("experimental", "referenceDefinition").optional(),
        response: T.reference("experimental", "referenceDefinition").optional(),
        invalidations: [
          T.reference("experimental", "routeInvalidationDefinition"),
        ],
        metadata: T.object()
          .keys({
            requestBodyType: T.string().oneOf("json", "form-data").optional(),
          })
          .loose()
          .optional(),
      })
      .loose(),

    T.object("routeInvalidationDefinition")
      .keys({
        type: "routeInvalidation",
        target: T.object()
          .keys({
            group: namePart,
            name: T.optional().value(namePart),
          })
          .loose(),
        properties: T.object()
          .keys({
            useSharedParams: T.bool().optional(),
            useSharedQuery: T.bool().optional(),
            specification: T.object()
              .keys({
                params: T.generic().keys(T.string()).values([T.string()]),
                query: T.generic().keys(T.string()).values([T.string()]),
              })
              .loose()
              .optional(),
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

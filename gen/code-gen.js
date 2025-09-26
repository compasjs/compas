import { TypeCreator } from "@compas/code-gen";

/**
 * Structure for types that are user input.
 *
 * @param {import("@compas/code-gen").Generator} generator
 */
export function extendWithCodeGen(generator) {
  const T = new TypeCreator("structure");

  const namePart = T.string("namePart")
    .min(1)
    .pattern(/^[a-zA-Z$][a-zA-Z\d]+$/g);

  const typeDefinitionBase = {
    docString: T.string().min(0).default(`""`),
    isOptional: T.bool().default(false),
    defaultValue: T.anyOf()
      .values(
        T.string().min(1),
        T.bool(),
        T.number().min(Number.MIN_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER),
      )
      .optional(),
    sql: T.object()
      .keys({
        primary: T.bool().optional(),
        searchable: T.bool().optional(),
        hasDefaultValue: T.bool().optional(),
      })
      .default(`{}`)
      .loose(),
    validator: T.object().default(`{}`).loose(),
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
          .values(T.reference("structure", "namedTypeDefinition")),
      ),

    T.object("generateOptions")
      .keys({
        targetLanguage: T.string().oneOf("js", "ts"),
        forceTsExtensionImports: T.bool().optional().docs(`
        Output '.ts' extension in imports for use with Node.js new type stripping features.
        `),

        outputDirectory: T.string()
          .optional()
          .docs(
            "Where to write the files to. If no directory is provided, a list of in memory files with contents is returned from the {@link Generator.generate} call.",
          ),

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
                  "Always generate validators for all named types even if no other generator needs it. This implies {@link StructureGenerateOptions.generators.types.includeBaseTypes}.",
                ),
            })
            .optional()
            .docs(
              "Alter the output of generated validators. Other generators will always include validators in their output if necessary.",
            ),

          apiClient: T.object()
            .keys({
              target: T.anyOf()
                .values(
                  {
                    library: "axios",
                    targetRuntime: T.string().oneOf(
                      "node.js",
                      "browser",
                      "react-native",
                    ),

                    includeWrapper: T.string()
                      .oneOf("react-query")
                      .optional()
                      .docs(
                        "Include an API client wrapper to use the api easier with your user interface library.",
                      ),

                    globalClient: T.bool()
                      .default(false)
                      .docs(
                        "Use a global api client that will be used for all requests.",
                      ),
                  },
                  {
                    library: "fetch",
                    targetRuntime: T.string().oneOf(
                      "node.js",
                      "browser",
                      "react-native",
                    ),

                    includeWrapper: T.string()
                      .oneOf("react-query")
                      .optional()
                      .docs(
                        "Include an API client wrapper to use the api easier with your user interface library.",
                      ),

                    globalClient: T.bool()
                      .default(false)
                      .docs(
                        "Use a global api client that will be used for all requests.",
                      ),
                  },
                )
                .docs("Select your HTTP client of choice."),

              responseValidation: T.object()
                .keys({
                  looseObjectValidation: T.bool(),
                })
                .loose()
                .default("{ looseObjectValidation: true, }")
                .docs(
                  `Determine how strict the API client response validations are. This defaults to loose object validation, allowing extra values in the responses which are not returned in the validated result. It is advised to disable this when you use the API client for e2e testing your server.`,
                ),
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
            })
            .optional()
            .docs(
              "Alter the output of the generated types, they are always generated as a result of other enabled generators.",
            ),
        },
      })
      .docs(
        "Select the targets and generators to be used when generating. See {@link https://compasjs.com/generators/targets.html} for more information.",
      )
      .loose(),

    // NOTE:
    // These types shouldn't use defaults, since we shouldn't alter the input structure.
    // These defaults should be applied in the builders or later on in some processor.

    T.anyOf("namedTypeDefinition")
      .docs(
        "This contains all types that can be added top level to the structure.",
      )
      .values(
        T.reference("structure", "anyDefinition"),
        T.reference("structure", "anyOfDefinition"),
        T.reference("structure", "arrayDefinition"),
        T.reference("structure", "booleanDefinition"),
        T.reference("structure", "crudDefinition"),
        T.reference("structure", "dateDefinition"),
        T.reference("structure", "extendDefinition"),
        T.reference("structure", "fileDefinition"),
        T.reference("structure", "genericDefinition"),
        T.reference("structure", "numberDefinition"),
        T.reference("structure", "objectDefinition"),
        T.reference("structure", "omitDefinition"),
        T.reference("structure", "pickDefinition"),
        T.reference("structure", "routeDefinition"),
        T.reference("structure", "stringDefinition"),
        T.reference("structure", "uuidDefinition"),
      )
      .discriminant("type"),

    T.anyOf("typeDefinition")
      .docs("This contains all known type definitions.")
      .values(
        T.reference("structure", "namedTypeDefinition"),
        T.reference("structure", "referenceDefinition"),
        T.reference("structure", "relationDefinition"),
        T.reference("structure", "routeInvalidationDefinition"),
      ),

    T.anyOf("typeSystemDefinition")
      .docs(
        "All type definitions that can be used inside other types, like object keys.",
      )
      .values(
        T.reference("structure", "anyDefinition"),
        T.reference("structure", "anyOfDefinition"),
        T.reference("structure", "arrayDefinition"),
        T.reference("structure", "booleanDefinition"),
        T.reference("structure", "crudDefinition"),
        T.reference("structure", "dateDefinition"),
        T.reference("structure", "extendDefinition"),
        T.reference("structure", "fileDefinition"),
        T.reference("structure", "genericDefinition"),
        T.reference("structure", "numberDefinition"),
        T.reference("structure", "objectDefinition"),
        T.reference("structure", "omitDefinition"),
        T.reference("structure", "pickDefinition"),
        T.reference("structure", "referenceDefinition"),
        T.reference("structure", "stringDefinition"),
        T.reference("structure", "uuidDefinition"),
      )
      .discriminant("type"),

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
              "tsKoaReceive",
              "jsKoaSend",
              "tsKoaSend",
              "jsPostgres",
              "tsPostgres",
              "jsAxios",
              "tsAxios",
              "jsAxiosNode",
              "tsAxiosBrowser",
              "tsAxiosReactNative",
              "jsFetch",
              "tsFetch",
              "jsFetchNode",
              "tsFetchBrowser",
              "tsFetchReactNative",
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
      })
      .loose(),

    T.object("anyOfDefinition")
      .keys({
        type: "anyOf",
        ...namedTypeDefinitionBase,
        validator: T.object()
          .keys({
            discriminant: T.string().optional(),
          })
          .default(`{}`)
          .loose(),
        values: T.array()
          .min(1)
          .values(T.reference("structure", "typeSystemDefinition")),
      })
      .loose(),

    T.object("arrayDefinition")
      .keys({
        type: "array",
        ...namedTypeDefinitionBase,
        values: T.reference("structure", "typeSystemDefinition"),
        validator: T.object()
          .keys({
            convert: T.bool(),
            min: T.number().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
            max: T.number().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
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
            allowNull: T.bool().default(false),
          })
          .loose(),
      })
      .loose(),

    T.object("crudDefinition")
      .keys({
        type: "crud",
        ...namedTypeDefinitionBase,
        basePath: T.string().optional(),
        entity: T.reference("structure", "referenceDefinition").optional(),
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
            readableType: T.reference(
              "structure",
              "referenceDefinition",
            ).optional(),
            writable: T.object()
              .keys({
                $omit: T.array().values(T.string()).optional(),
                $pick: T.array().values(T.string()).optional(),
              })
              .loose()
              .optional(),
          })
          .loose(),
        inlineRelations: [T.reference("structure", "crudDefinition")],
        nestedRelations: [T.reference("structure", "crudDefinition")],
      })
      .loose(),

    T.object("dateDefinition")
      .keys({
        type: "date",
        ...namedTypeDefinitionBase,
        specifier: T.string().oneOf("dateOnly", "timeOnly").optional(),
        validator: T.object()
          .keys({
            allowNull: T.bool().default(false),
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
          .values(T.reference("structure", "typeSystemDefinition")),
        reference: T.reference("structure", "referenceDefinition"),
        relations: T.array().values(
          T.reference("structure", "relationDefinition"),
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
        keys: T.reference("structure", "typeSystemDefinition"),
        values: T.reference("structure", "typeSystemDefinition"),
      })
      .loose(),

    T.object("numberDefinition")
      .keys({
        type: "number",
        ...namedTypeDefinitionBase,
        oneOf: T.array()
          .values(
            T.number()
              .min(Number.MIN_SAFE_INTEGER)
              .max(Number.MAX_SAFE_INTEGER),
          )
          .optional(),
        validator: T.object()
          .keys({
            floatingPoint: T.bool(),
            min: T.number()
              .min(Number.MIN_SAFE_INTEGER)
              .max(Number.MAX_SAFE_INTEGER)
              .optional(),
            max: T.number()
              .min(Number.MIN_SAFE_INTEGER)
              .max(Number.MAX_SAFE_INTEGER)
              .optional(),
            allowNull: T.bool().default(false),
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
            allowNull: T.bool().default(false),
            strict: T.bool(),
          })
          .loose(),
        keys: T.generic()
          .keys(T.string())
          .values(T.reference("structure", "typeSystemDefinition")),
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
          T.reference("structure", "relationDefinition"),
        ),
      })
      .loose(),

    T.object("omitDefinition")
      .keys({
        type: "omit",
        ...namedTypeDefinitionBase,
        validator: T.object()
          .keys({
            allowNull: T.bool().default(false),
            strict: T.bool(),
          })
          .loose(),
        keys: [T.string()],
        reference: T.reference("structure", "typeSystemDefinition"),
      })
      .loose(),

    T.object("pickDefinition")
      .keys({
        type: "pick",
        ...namedTypeDefinitionBase,
        validator: T.object()
          .keys({
            allowNull: T.bool().default(false),
            strict: T.bool(),
          })
          .loose(),
        keys: [T.string()],
        reference: T.reference("structure", "typeSystemDefinition"),
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
        reference: T.reference("structure", "referenceDefinition"),
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
        query: T.reference("structure", "referenceDefinition").optional(),
        params: T.reference("structure", "referenceDefinition").optional(),
        body: T.reference("structure", "referenceDefinition").optional(),
        response: T.reference("structure", "referenceDefinition").optional(),
        invalidations: [
          T.reference("structure", "routeInvalidationDefinition"),
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
            trim: T.bool(),
            lowerCase: T.bool(),
            upperCase: T.bool(),
            min: T.number().min(0).max(Number.MAX_SAFE_INTEGER).default(1),
            max: T.number().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
            pattern: T.string().optional(),
            allowNull: T.bool().default(false),
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
            allowNull: T.bool().default(false),
          })
          .loose(),
      })
      .loose(),
  );
}

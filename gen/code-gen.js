import { TypeCreator } from "@compas/code-gen";

/**
 * @param app
 */
export function applyCodeGenStructure(app) {
  const T = new TypeCreator("codeGen");

  const types = getTypes(T);

  app.add(T.anyOf("type").values(...types));
  app.add(...types);
  app.add(
    T.generic("structure")
      .keys(T.string())
      .values(
        T.generic().keys(T.string()).values(T.reference("codeGen", "type")),
      ),
  );

  app.add(
    T.object("context").keys({
      options: T.any().raw(`import("../../App").GenerateOpts`),
      structure: T.reference("codeGen", "structure"),
      extension: T.string().oneOf(".js", ".ts"),
      importExtension: T.string(),
      outputFiles: T.array().values(T.reference("codeGen", "file")),
      errors: [
        T.anyOf().values(
          {
            key: "structureReservedGroupName",
            groupName: T.string(),
          },
          {
            key: "structureUnknownOrEmptyGroup",
            groupName: T.string(),
          },
          {
            key: "sqlMissingPrimaryKey",
            typeName: T.string(),
          },
          {
            key: "sqlForgotEnableQueries",
            typeName: T.string(),
            referencedByType: T.string(),
          },
          {
            key: "sqlMissingOneToMany",
            referencedByGroup: T.string(),
            referencedByType: T.string(),
            typeName: T.string(),
            relationOwnKey: T.string(),
          },
          {
            key: "sqlUnusedOneToMany",
            type: T.string(),
            referencedType: T.string(),
            ownKey: T.string(),
          },
          {
            key: "sqlEnableValidator",
          },
          {
            key: "sqlDuplicateShortName",
            shortName: T.string(),
            firstName: T.string(),
            secondName: T.string(),
          },
          {
            key: "sqlReservedRelationKey",
            type: T.string(),
            ownKey: T.string(),
          },
          {
            key: "sqlUsedRelationKey",
            type: T.string(),
            ownKey: T.string(),
          },
        ),
      ],
    }),
    T.object("file").keys({
      relativePath: T.string(),
      contents: T.string(),
    }),
    T.object("templateState").keys({
      phase: T.string().oneOf("init", "collect", "finish"),
    }),
    T.object("typeSettings").keys({
      isJSON: T.bool().optional(),
      nestedIsJSON: T.bool().optional(),
      useDefaults: T.bool().optional(),
      useTypescript: T.bool().optional(),
      isNode: T.bool().optional(),
      isBrowser: T.bool().optional(),
      suffix: T.string().optional(),
      isCommonFile: T.bool().optional(),
      isTypeFile: T.bool().optional(),
      fileTypeIO: T.string()
        .oneOf("input", "outputRouter", "outputClient")
        .optional(),
    }),
  );
}

/**
 * @param {TypeCreator} T
 */
function getTypes(T) {
  const typeBase = {
    docString: T.string().default(`""`),
    isOptional: T.bool().default(false),
    defaultValue: T.anyOf()
      .values(T.string().min(0), T.bool(), T.number())
      .optional(),
    uniqueName: T.string().optional(),
    group: T.string().optional(),
    name: T.string().optional(),
    sql: T.object()
      .keys({
        primary: T.bool().default(false),
        searchable: T.bool().default(false),
        hasDefaultValue: T.bool().default(false),
      })
      .optional()
      .loose(),
    validator: T.object().loose().default("{}"),
    internalSettings: T.object()
      .loose()
      .default("{}")
      .docs(
        "Used where the public spec isn't complete enough for all things we want to support for OpenAPI.",
      ),
  };

  const anyType = T.object("anyType").keys({
    type: "any",
    ...typeBase,
    validator: T.object()
      .keys({
        allowNull: T.bool().default(false),
      })
      .default("{ allowNull: false }")
      .loose(),
    rawValue: T.string().optional(),
    rawValueImport: T.object()
      .keys({
        javaScript: T.string().optional(),
        typeScript: T.string().optional(),
      })
      .default("{}")
      .loose(),
    rawValidator: T.string().optional(),
    rawValidatorImport: T.object()
      .keys({
        javaScript: T.string().optional(),
        typeScript: T.string().optional(),
      })
      .default("{}")
      .loose(),
  });

  const anyOfType = T.object("anyOfType").keys({
    type: "anyOf",
    ...typeBase,
    values: [T.reference("codeGen", "type")],
  });

  const arrayType = T.object("arrayType").keys({
    type: "array",
    ...typeBase,
    validator: T.object()
      .keys({
        convert: T.bool().default(false),
        min: T.number().optional(),
        max: T.number().optional(),
      })
      .loose(),
    values: T.reference("codeGen", "type"),
  });

  const booleanType = T.object("booleanType").keys({
    type: "boolean",
    ...typeBase,
    oneOf: T.bool().optional(),
    validator: T.object()
      .keys({
        convert: T.bool().default(false),
        allowNull: T.bool().default(false),
      })
      .loose(),
  });

  const dateType = T.object("dateType").keys({
    type: "date",
    ...typeBase,
    validator: T.object()
      .keys({
        allowNull: T.bool().default(false),
        min: T.date().optional(),
        max: T.date().optional(),
        inFuture: T.bool().optional(),
        inPast: T.bool().optional(),
      })
      .default("{ allowNull: false }")
      .loose(),
  });

  const fileType = T.object("fileType").keys({
    type: "file",
    ...typeBase,
    validator: T.object()
      .keys({
        mimeTypes: T.array().values(T.string()).optional(),
      })
      .default("{}")
      .loose(),
  });

  const genericType = T.object("genericType").keys({
    type: "generic",
    ...typeBase,
    keys: T.reference("codeGen", "type"),
    values: T.reference("codeGen", "type"),
  });

  const numberType = T.object("numberType").keys({
    type: "number",
    ...typeBase,
    oneOf: T.array().values(T.number()).optional(),
    validator: T.object()
      .keys({
        convert: T.bool().default(false),
        floatingPoint: T.bool().default(false),
        min: T.number().optional(),
        max: T.number().optional(),
        allowNull: T.bool().default(false),
      })
      .loose(),
  });

  const objectType = T.object("objectType").keys({
    type: "object",
    ...typeBase,
    shortName: T.string().optional(),
    validator: T.object()
      .keys({
        allowNull: T.bool().default(false),
        strict: T.bool().default(true),
      })
      .loose(),
    keys: T.generic().keys(T.string()).values(T.reference("codeGen", "type")),
    enableQueries: T.bool().default(false),
    queryOptions: T.object()
      .keys({
        withSoftDeletes: T.bool().default(false),
        withDates: T.bool().default(false),
        withPrimaryKey: T.bool().default(true),
        isView: T.bool().default(false),
        schema: T.string().default(`""`),
      })
      .optional()
      .loose(),
    relations: T.array()
      .values(T.reference("codeGen", "relationType"))
      .default("[]"),
    where: T.object()
      .keys({
        type: T.string(),
        rawType: T.reference("codeGen", "objectType"),
        fields: T.array().values(
          T.object()
            .keys({
              key: T.string(),
              name: T.string(),
              isRelation: T.bool().optional().default(false),
              variant: T.string().oneOf(
                "equal",
                "notEqual",
                "in",
                "notIn",
                "greaterThan",
                "lowerThan",
                "isNull",
                "isNotNull",
                "includeNotNull",
                "like",
                "iLike",
                "notLike",
                "exists",
                "notExists",
              ),
            })
            .loose(),
        ),
      })
      .optional()
      .loose(),
    orderBy: T.object()
      .keys({
        type: T.string(),
        specType: T.string(),
        fields: T.array().values(
          T.object()
            .keys({
              key: T.string(),
              optional: T.bool(),
            })
            .loose(),
        ),
      })
      .optional()
      .loose(),
    partial: T.object()
      .keys({
        insertType: T.string(),
        updateType: T.string(),
        fields: T.array().values(
          T.object()
            .keys({
              key: T.string(),
              defaultValue: T.string().optional(),
              hasSqlDefault: T.bool().default(false),
              isJsonb: T.bool().default(false),
            })
            .loose(),
        ),
      })
      .optional()
      .loose(),
  });

  const referenceType = T.object("referenceType").keys({
    type: "reference",
    ...typeBase,
    reference: T.anyOf().values(
      T.reference("codeGen", "type"),
      T.pick().object(typeBase).keys("group", "name", "uniqueName"),
    ),
  });

  const relationType = T.object("relationType").keys({
    type: "relation",
    subType: T.string().oneOf(
      "manyToOne",
      "oneToMany",
      "oneToOne",
      "oneToOneReverse",
    ),
    reference: T.reference("codeGen", "referenceType"),
    ownKey: T.string(),
    referencedKey: T.string().optional(),
    isOptional: T.bool().default(false),
  });

  const stringType = T.object("stringType").keys({
    type: "string",
    ...typeBase,
    oneOf: T.array().values(T.string()).optional(),
    validator: T.object()
      .keys({
        convert: T.bool().default(false),
        trim: T.bool().default(false),
        lowerCase: T.bool().default(false),
        upperCase: T.bool().default(false),
        min: T.number().default(1),
        max: T.number().optional(),
        pattern: T.string().optional(),
        allowNull: T.bool().default(false),
        disallowedCharacters: T.optional()
          .value([T.string().min(1).max(2)])
          .optional(),
      })
      .loose(),
  });

  const uuidType = T.object("uuidType").keys({
    type: "uuid",
    ...typeBase,
    validator: T.object()
      .keys({
        allowNull: T.bool().default(false),
      })
      .default("{ allowNull: false }")
      .loose(),
  });

  const routeType = T.object("routeType").keys({
    type: "route",
    ...typeBase,
    method: T.string().oneOf("GET", "POST", "PUT", "DELETE", "HEAD", "PATCH"),
    idempotent: T.bool().default(false),
    path: T.string(),
    tags: [T.string()],
    query: T.reference("codeGen", "type").optional(),
    params: T.reference("codeGen", "type").optional(),
    body: T.reference("codeGen", "type").optional(),
    files: T.reference("codeGen", "type").optional(),
    response: T.reference("codeGen", "type").optional(),

    // Needs to be in sync with `recursivelyRemoveInternalFields`
    internalSettings: T.object()
      .keys({
        requestBodyType: T.string().oneOf("json", "form-data").optional(),
      })
      .loose()
      .default(`{ "requestBodyType": "json" }`),
  });

  const allTypes = [
    anyType,
    anyOfType,
    arrayType,
    booleanType,
    dateType,
    fileType,
    genericType,
    numberType,
    objectType,
    referenceType,
    relationType,
    stringType,
    uuidType,
    routeType,
  ];

  return allTypes.map((it) => it.loose());
}

import { TypeCreator } from "@lbu/code-gen";

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
    T.object("generateOpts").keys({
      enabledGroups: T.array().values(T.string()),
      isBrowser: T.bool(),
      isNode: T.bool(),
      isNodeServer: T.bool(),
      enabledGenerators: T.array().values(
        T.string().oneOf(
          "type",
          "validator",
          "router",
          "sql",
          "apiClient",
          "reactQuery",
        ),
      ),
      useTypescript: T.bool(),
      dumpStructure: T.bool(),
      fileHeader: T.string(),
      outputDirectory: T.string(),
    }),
    T.object("context").keys({
      options: T.reference("codeGen", "generateOpts"),
      structure: T.reference("codeGen", "structure"),
      extension: T.string().oneOf(".js", ".ts"),
      importExtension: T.string(),
      outputFiles: T.array().values(T.reference("codeGen", "file")),
      rootExports: T.array().values(T.string()),
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
      })
      .optional(),
  };

  const anyType = T.object("anyType").keys({
    type: "any",
    ...typeBase,
  });

  const anyOfType = T.object("anyOfType").keys({
    type: "anyOf",
    ...typeBase,
    values: [T.reference("codeGen", "type")],
  });

  const arrayType = T.object("arrayType").keys({
    type: "array",
    ...typeBase,
    validator: {
      convert: T.bool().default(false),
      min: T.number().optional(),
      max: T.number().optional(),
    },
    values: T.reference("codeGen", "type"),
  });

  const booleanType = T.object("booleanType").keys({
    type: "boolean",
    ...typeBase,
    oneOf: T.bool().optional(),
    validator: {
      convert: T.bool().default(false),
    },
  });

  const dateType = T.object("dateType").keys({
    type: "date",
    ...typeBase,
  });

  const fileType = T.object("fileType").keys({
    type: "file",
    ...typeBase,
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
    validator: {
      convert: T.bool().default(false),
      floatingPoint: T.bool().default(false),
      min: T.number().optional(),
      max: T.number().optional(),
    },
  });

  const objectType = T.object("objectType").keys({
    type: "object",
    ...typeBase,
    validator: {
      strict: T.bool().default(true),
    },
    keys: T.generic().keys(T.string()).values(T.reference("codeGen", "type")),
    enableQueries: T.bool().default(false),
    queryOptions: T.object()
      .keys({
        withSoftDeletes: T.bool().default(false),
        withDates: T.bool().default(false),
        withPrimaryKey: T.bool().default(true),
        isView: T.bool().default(false),
      })
      .optional(),
    relations: T.array()
      .values(T.reference("codeGen", "relationType"))
      .default("[]"),
    shortName: T.string().optional(),
    where: T.object()
      .keys({
        type: T.string(),
        fields: T.array().values({
          key: T.string(),
          name: T.string(),
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
            "notLike",
          ),
        }),
      })
      .optional(),
    partial: T.object()
      .keys({
        insertType: T.string(),
        updateType: T.string(),
        fields: T.array().values({
          key: T.string(),
          defaultValue: T.string().optional(),
          isJsonb: T.bool().default(false),
        }),
      })
      .optional(),
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
    validator: {
      convert: T.bool().default(false),
      trim: T.bool().default(false),
      lowerCase: T.bool().default(false),
      upperCase: T.bool().default(false),
      min: T.number().default(1),
      max: T.number().optional(),
      pattern: T.string().optional(),
    },
  });

  const uuidType = T.object("uuidType").keys({
    type: "uuid",
    ...typeBase,
  });

  const routeType = T.object("routeType").keys({
    type: "route",
    ...typeBase,
    method: T.string().oneOf("GET", "POST", "PUT", "DELETE", "HEAD", "PATCH"),
    path: T.string(),
    tags: [T.string()],
    query: T.reference("codeGen", "type").optional(),
    params: T.reference("codeGen", "type").optional(),
    body: T.reference("codeGen", "type").optional(),
    files: T.reference("codeGen", "type").optional(),
    response: T.reference("codeGen", "type").optional(),
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

import { TypeCreator } from "@lbu/code-gen";

/**
 * @param app
 */
export function applyCodeGenStructure(app) {
  const T = new TypeCreator("codeGen");

  const typeBase = {
    docString: T.string().default("").min(0),
    isOptional: T.bool().default(false),
    defaultValue: T.anyOf()
      .values(T.string().min(0), T.bool(), T.number())
      .optional(),
    uniqueName: T.string().optional(),
    group: T.string().optional(),
    name: T.string().optional(),
  };

  const anyType = T.object("anyType").keys({
    type: "any",
    ...typeBase,
    typeOf: T.string().optional(),
    instanceOf: T.string().optional(),
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
      strict: T.bool().default(false),
    },
    keys: T.generic().keys(T.string()).values(T.reference("codeGen", "type")),
  });

  const referenceType = T.object("referenceType").keys({
    type: "reference",
    ...typeBase,
    reference: T.pick().object(typeBase).keys("group", "name", "uniqueName"),
  });

  const relationType = T.object("relationType").keys({
    type: "relation",
    ...typeBase,
    relationType: T.string().oneOf("oneToOne", "oneToMany", "manyToOne"),
    left: T.reference("codeGen", "type"),
    leftKey: T.string(),
    right: T.reference("codeGen", "type"),
    rightKey: T.string(),
    substituteKey: T.string(),
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
    method: T.string().oneOf("GET", "POST", "PUT", "DELETE", "HEAD"),
    path: T.string(),
    tags: [T.string()],
    query: T.reference("codeGen", "type").optional(),
    params: T.reference("codeGen", "type").optional(),
    body: T.reference("codeGen", "type").optional(),
    files: T.reference("codeGen", "type").optional(),
    response: T.reference("codeGen", "type").optional(),
  });

  const types = [
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

  app.add(T.anyOf("type").values(...types));
  app.add(...types);
  app.add(
    T.generic("structure")
      .keys(T.string())
      .values(
        T.generic().keys(T.string()).values(T.reference("codeGen", "type")),
      ),
  );
}

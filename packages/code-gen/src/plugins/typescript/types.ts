import {
  AnyOfType,
  ArrayType,
  BooleanType,
  NamedType,
  NumberType,
  ObjectType,
  ReferenceType,
  StringType,
  TypeUnion,
  WrappedAbstractTree,
} from "../../types";

export function buildTypes(tree: WrappedAbstractTree): string {
  const result: string[] = [];

  for (const type of Object.values(tree.types)) {
    result.push(createNamedType(type));
  }

  return result.join("\n");
}

export function createNamedType(type: NamedType): string {
  return `export type ${type.name} = ${createType(type)};`;
}

export function createType(type: TypeUnion): string {
  switch (type.type) {
    case "number":
      return createNumberType(type);
    case "string":
      return createStringType(type);
    case "boolean":
      return createBooleanType(type);
    case "object":
      return createObjectType(type);
    case "array":
      return createArrayType(type);
    case "anyOf":
      return createAnyOfType(type);
    case "reference":
      return createReferenceType(type);
  }
}

export function createNumberType(type: NumberType): string {
  let result = "";
  if (type.oneOf) {
    result += type.oneOf.join(" | ");
  } else {
    result += "number";
  }
  if (type.optional) {
    result += " | undefined";
  }
  return result;
}

export function createStringType(type: StringType): string {
  let result = "";
  if (type.oneOf) {
    result += type.oneOf.map(it => `"${it}"`).join(" | ");
  } else {
    result += "string";
  }
  if (type.optional) {
    result += " | undefined";
  }
  return result;
}

export function createBooleanType(type: BooleanType): string {
  let result = "";
  if (type.oneOf) {
    result += String(type.oneOf[0]);
  } else {
    result += "boolean";
  }

  if (type.optional) {
    result += " | undefined";
  }

  return result;
}

export function createObjectType(type: ObjectType): string {
  let result = "{\n";

  if (type.keys) {
    for (const [key, value] of Object.entries(type.keys)) {
      result += `${key}: ${createType(value)};\n`;
    }
  }

  result += "}";

  if (type.optional) {
    result += " | undefined";
  }

  return result;
}

export function createArrayType(type: ArrayType): string {
  let result = `(${createType(type.values)})[]`;

  if (type.optional) {
    result += " | undefined";
  }

  return result;
}

export function createAnyOfType(type: AnyOfType): string {
  let result = type.anyOf
    .map(it => createType(it))
    .map(it => `(${it})`)
    .join(" | ");

  if (type.optional) {
    result += " | undefined";
  }

  return result;
}

export function createReferenceType(type: ReferenceType): string {
  let result = `${type.reference}`;
  if (type.optional) {
    result += " | undefined";
  }

  return result;
}

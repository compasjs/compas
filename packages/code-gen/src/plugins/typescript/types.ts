import {
  AbstractArrayType,
  AbstractBooleanType,
  AbstractNumberType,
  AbstractObjectType,
  AbstractOneOfType,
  AbstractRefType,
  AbstractStringType,
  AbstractTree,
  AbstractTypeUnion,
  NamedAbstractType,
} from "../../types";

export function buildTypes(tree: AbstractTree): string {
  const result: string[] = [];

  for (const type of Object.values(tree.types)) {
    result.push(createNamedType(type));
  }

  return result.join("\n");
}

export function createNamedType(type: NamedAbstractType): string {
  return `export type ${type.name} = ${createType(type)};`;
}

export function createType(type: AbstractTypeUnion): string {
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
    case "oneOf":
      return createOneOfType(type);
    case "ref":
      return createReferenceType(type);
  }
}

export function createNumberType(type: AbstractNumberType): string {
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

export function createStringType(type: AbstractStringType): string {
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

export function createBooleanType(type: AbstractBooleanType): string {
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

export function createObjectType(type: AbstractObjectType): string {
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

export function createArrayType(type: AbstractArrayType): string {
  let result = `(${createType(type.values)})[]`;

  if (type.optional) {
    result += " | undefined";
  }

  return result;
}

export function createOneOfType(type: AbstractOneOfType): string {
  let result = type.oneOf
    .map(it => createType(it))
    .map(it => `(${it})`)
    .join(" | ");

  if (type.optional) {
    result += " | undefined";
  }

  return result;
}

export function createReferenceType(type: AbstractRefType): string {
  let result = `${type.ref}`;
  if (type.optional) {
    result += " | undefined";
  }

  return result;
}

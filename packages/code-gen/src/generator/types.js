import { isNil } from "@lbu/stdlib";
import { upperCaseFirst } from "../utils.js";
import { js } from "./tag/index.js";

/**
 * Setup stores for memoized types, so we can reuse types if necessary
 * @param {CodeGenContext} context
 */
export function setupMemoizedTypes(context) {
  context.types = {
    defaultSettings: {
      isJSON: false,
      useTypescript: context.options.useTypescript,
      useDefaults: true,
      nestedIsJSON: false,
      isNode: context.options.isNode,
      isBrowser: context.options.isBrowser,
      suffix: "",
      fileTypeIO: "outputClient",
    },
    typeMap: new Map(),
  };

  for (const group of Object.values(context.structure)) {
    for (const type of Object.values(group)) {
      getTypeNameForType(context, type, "", { forceRegisterType: true });
    }
  }
}

/**
 * Use the memoized types and the provided settings to create a new type
 * @param {CodeGenContext} context
 * @param {CodeGenType} type
 * @param {string} suffix
 * @param {CodeGenTypeSettings & { forceRegisterType?: boolean }} settings
 */
export function getTypeNameForType(context, type, suffix, settings) {
  const stringOfType = generateTypeDefinition(type, {
    ...context.types.defaultSettings,
    ...settings,
    suffix,
  });

  if (!settings.forceRegisterType) {
    let found = undefined;
    for (const [foundName, foundValue] of context.types.typeMap.entries()) {
      if (foundValue === stringOfType) {
        found = foundName;
        break;
      }
    }

    return found;
  }

  const name = `${type?.uniqueName ?? ""}${upperCaseFirst(suffix)}`;
  context.types.typeMap.set(name, stringOfType);

  return name;
}

/**
 * @param {CodeGenContext} context
 */
export function generateTypeFile(context) {
  const typeFile = js`

    // An export soo all things work correctly with linters, ts, ...
    export const __generated__ = true;

    ${getMemoizedNamedTypes(context)}
  `;

  context.outputFiles.push({
    contents: typeFile,
    relativePath: `./types${context.extension}`,
  });

  context.rootExports.push(`export * from "./types.js";`);
}

/**
 * @param {CodeGenType} type
 * @param {CodeGenTypeSettings} settings
 */
export function generateTypeDefinition(
  type,
  {
    isJSON,
    nestedIsJSON,
    useDefaults,
    useTypescript,
    isNode,
    isBrowser,
    suffix,
    fileTypeIO,
  } = {},
) {
  const recurseSettings = {
    isRoot: false,
    isJSON: isJSON || nestedIsJSON || false,
    nestedIsJSON,
    useDefaults,
    useTypescript,
    isNode,
    isBrowser,
    suffix: suffix ?? "",
    fileTypeIO,
  };

  if (isNil(type)) {
    type = { type: "any", isOptional: true };
  }

  let result = "";

  if (type.isOptional && (!useDefaults || isNil(type.defaultValue))) {
    result += "undefined|";
  }
  if (type.validator?.allowNull && (!useDefaults || isNil(type.defaultValue))) {
    result += "null|";
  }

  switch (type.type) {
    case "any":
      if (useTypescript) {
        result += "any";
      } else {
        result += "*";
      }
      break;
    case "anyOf":
      result += type.values
        .map((it) => generateTypeDefinition(it, recurseSettings))
        .join("|");
      break;
    case "array":
      result += "(";
      result += generateTypeDefinition(type.values, recurseSettings);
      result += ")[]";
      break;
    case "boolean":
      if (type.oneOf && useTypescript) {
        result += type.oneOf;
      } else {
        result += "boolean";
      }
      if (useTypescript && type.validator.convert) {
        if (type.oneOf) {
          result += `"${type.oneOf}"`;
        } else {
          result += `|"true"|"false"`;
        }
      }
      break;
    case "date":
      if (isJSON) {
        result += "string";
      } else {
        result += "Date";
      }
      break;
    case "file":
      if (fileTypeIO === "input" && isBrowser) {
        result += `{ name?: string, data: Blob }`;
      } else if (fileTypeIO === "input" && isNode) {
        result += `{ name?: string, data: ReadableStream }`;
      } else if (fileTypeIO === "outputRouter") {
        result += `{ size: number, path: string, name?: string, type?: string, lastModifiedDate?: Date, hash?: "sha1" | "md5" | "sha256" }`;
      } else if (fileTypeIO === "outputClient" && isBrowser) {
        result += "Blob";
      } else if (fileTypeIO === "outputClient" && isNode) {
        result += "ReadableStream";
      } else {
        result += useTypescript ? "unknown" : "*";
      }
      break;
    case "generic":
      if (useTypescript) {
        if (Array.isArray(type.keys.oneOf)) {
          result += `{ [ key in `;
          result += generateTypeDefinition(type.keys, recurseSettings);
        } else {
          result += `{ [ key: `;
          result += generateTypeDefinition(type.keys, recurseSettings);
        }
        result += "]:";
        result += generateTypeDefinition(type.values, recurseSettings);
        result += "}";
      } else {
        result += `Object<${generateTypeDefinition(
          type.keys,
          recurseSettings,
        )}, ${generateTypeDefinition(type.values, recurseSettings)}>`;
      }
      break;
    case "number":
      if (type.oneOf) {
        result += type.oneOf.join("|");
      } else {
        result += "number";
      }
      break;
    case "object":
      result += "{";
      for (const key of Object.keys(type.keys)) {
        let right = generateTypeDefinition(type.keys[key], recurseSettings);

        let separator = ":";
        if (right.startsWith("undefined|")) {
          separator = "?:";
          right = right.substring(10);
        }

        result += `"${key}"${separator} ${right}, `;
      }
      result += "}";
      break;
    case "reference":
      if ((suffix ?? "") !== "") {
        result += generateTypeDefinition(type.reference, {
          isJSON,
          nestedIsJSON,
          useDefaults,
          useTypescript,
          isNode,
          isBrowser,
          suffix,
          fileTypeIO,
        });
      } else {
        result += type.reference.uniqueName;
      }

      break;
    case "string":
      if (type.oneOf) {
        result += `"${type.oneOf.join(`"|"`)}"`;
      } else {
        result += "string";
      }
      break;
    case "uuid":
      result += `string`;
      break;
    default:
      // Just use the 'undefined' flow, so an any type
      return generateTypeDefinition(undefined, recurseSettings);
  }

  return result;
}

/**
 * @param {CodeGenContext} context
 * @returns {string[]}
 */
function getMemoizedNamedTypes(context) {
  const result = [];
  const { useTypescript } = context.types.defaultSettings;
  const uniqueNameDocsMap = {};

  for (const group of Object.values(context.structure)) {
    for (const value of Object.values(group)) {
      if (value.docString && value.docString.length > 0) {
        uniqueNameDocsMap[upperCaseFirst(value.uniqueName)] = value.docString;
      }
    }
  }

  for (const [name, type] of context.types.typeMap.entries()) {
    let intermediate = "";

    if (useTypescript) {
      if (uniqueNameDocsMap[name]) {
        intermediate += `// ${uniqueNameDocsMap[name]}\n`;
      }
      intermediate += `export type ${name} = `;
    } else {
      intermediate += `/**\n * @name ${name}\n`;

      if (uniqueNameDocsMap[name]) {
        intermediate += ` * ${uniqueNameDocsMap[name]}\n`;
      }

      intermediate += ` * @typedef {`;
    }

    intermediate += type;

    if (useTypescript) {
      intermediate += `;`;
    } else {
      intermediate += `}\n */`;
    }

    result.push(intermediate);
  }

  return result;
}

import { isNil } from "@lbu/stdlib";
import { upperCaseFirst } from "../utils.js";
import { js } from "./tag/index.js";

export function getTypeSuffixForUseCase(options) {
  if (options.isBrowser) {
    return {
      apiResponse: "Api",
      apiInput: "Input",
    };
  }
  return {
    apiResponse: "ApiResponse",
    apiInput: "Input",
  };
}

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
    rawImports: new Set(),
    typeMap: new Map(),
    calculatingTypes: new Set(),
  };

  if (!context.options.isBrowser) {
    for (const group of Object.values(context.structure)) {
      for (const type of Object.values(group)) {
        getTypeNameForType(context, type, "", {});
      }
    }
  }
}

/**
 * Use the memoized types and the provided settings to create a new type
 * @param {CodeGenContext} context
 * @param {CodeGenType} type
 * @param {string} suffix
 * @param {CodeGenTypeSettings} settings
 */
export function getTypeNameForType(context, type, suffix, settings) {
  const hasName = !isNil(type?.uniqueName);

  // Potential new name, should be registered any way
  const name = `${type?.uniqueName ?? ""}${upperCaseFirst(suffix ?? "")}`;

  if (hasName && context.types.typeMap.has(name)) {
    return name;
  }

  // Recursive type handling
  if (hasName && context.types.calculatingTypes.has(name)) {
    return name;
  }

  // Setup type
  if (hasName) {
    context.types.calculatingTypes.add(name);
    context.types.typeMap.set(name, "");
  }

  const stringOfType = generateTypeDefinition(context, type, {
    ...context.types.defaultSettings,
    ...settings,
    suffix,
  });

  if (!hasName) {
    return stringOfType;
  }

  // Check if the same type value already exists
  let found = undefined;
  for (const [foundName, foundValue] of context.types.typeMap.entries()) {
    if (foundValue === stringOfType) {
      found = foundName;
      break;
    }
  }

  if (!found) {
    context.types.typeMap.set(name, stringOfType);
    found = name;
  } else if (found && name !== found) {
    context.types.typeMap.set(name, found);
    found = name;
  }

  context.types.calculatingTypes.delete(name);

  return found;
}

/**
 * @param {CodeGenContext} context
 */
export function generateTypeFile(context) {
  const typeFile = js`
    ${[...context.types.rawImports]}
    // An export soo all things work correctly with linters, ts, ...
    export const __generated__ = true;

    ${getMemoizedNamedTypes(context)}
  `;

  context.outputFiles.push({
    contents: typeFile,
    relativePath: `./types${context.extension}`,
  });

  context.rootExports.push(
    `export * from "./types${context.importExtension}";`,
  );
}

/**
 * @param {CodeGenContext} context
 * @param {CodeGenType} type
 * @param {CodeGenTypeSettings} settings
 */
export function generateTypeDefinition(
  context,
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
      if (!isNil(type.rawValue)) {
        result += type.rawValue;
        if (useTypescript && type.rawValueImport.typeScript) {
          context.types.rawImports.add(type.rawValueImport.typeScript);
        } else if (!useTypescript && type.rawValueImport.javaScript) {
          context.types.rawImports.add(type.rawValueImport.javaScript);
        }
      } else {
        if (useTypescript) {
          result += "any";
        } else {
          result += "*";
        }
      }
      break;
    case "anyOf": {
      let didHaveUndefined = result.startsWith("undefined");
      let didHaveNull = result.startsWith("null");

      result += type.values
        .map((it) => {
          let partial = generateTypeDefinition(context, it, recurseSettings);

          if (partial.startsWith("undefined")) {
            if (didHaveUndefined) {
              partial = partial.substring(10);
            } else {
              didHaveUndefined = true;
            }
          }

          if (partial.startsWith("null")) {
            if (didHaveNull) {
              partial = partial.substring(10);
            } else {
              didHaveNull = true;
            }
          }

          return partial;
        })
        .join("|");

      break;
    }
    case "array":
      result += "(";
      result += generateTypeDefinition(context, type.values, recurseSettings);
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
      if (isJSON || isBrowser) {
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
          result += generateTypeDefinition(context, type.keys, recurseSettings);
        } else {
          result += `{ [ key: `;
          result += generateTypeDefinition(context, type.keys, recurseSettings);
        }
        result += "]:";
        result += generateTypeDefinition(context, type.values, recurseSettings);
        result += "}";
      } else {
        result += `Object<${generateTypeDefinition(
          context,
          type.keys,
          recurseSettings,
        )}, ${generateTypeDefinition(context, type.values, recurseSettings)}>`;
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
        let right = generateTypeDefinition(
          context,
          type.keys[key],
          recurseSettings,
        );

        let separator = ":";
        if (right.startsWith("undefined|")) {
          separator = "?:";
          right = right.substring(10);
        }

        result += `"${key}"${separator} ${right}, `;
      }
      result += "}";
      break;
    case "reference": {
      result += getTypeNameForType(
        context,
        type.reference,
        suffix,
        recurseSettings,
      );

      break;
    }
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
      return generateTypeDefinition(context, undefined, recurseSettings);
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

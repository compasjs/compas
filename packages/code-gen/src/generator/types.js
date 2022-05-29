// @ts-nocheck

import { isNil } from "@compas/stdlib";
import { structureIteratorNamedTypes } from "../structure/structureIterators.js";
import { upperCaseFirst } from "../utils.js";
import { js } from "./tag/index.js";

/**
 * @param options
 * @returns {{apiInput: string, apiResponse: string}}
 */
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
 *
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function setupMemoizedTypes(context) {
  context.types = {
    defaultSettings: {
      isJSON: false,
      useTypescript: context.options.useTypescript,
      useConvert: false,
      useDefaults: true,
      isNode: context.options.isNode,
      isBrowser: context.options.isBrowser,
      suffix: "",
      fileTypeIO: "outputClient",
    },
    ...context.options.typeCache,
  };

  if (!context.types.typeMap) {
    Object.assign(context.types, {
      rawImports: new Set(),
      typeMap: new Map(),
      calculatingTypes: new Set(),
    });
  }

  if (!context.options.isBrowser) {
    for (const type of structureIteratorNamedTypes(context.structure)) {
      if (type.type === "route" || type.type === "crud") {
        continue;
      }

      getTypeNameForType(context, type, "", {
        isTypeFile: true,
      });
    }
  }
}

/**
 * Use the memoized types and the provided settings to create a new type
 *
 * @param {import("../generated/common/types").CodeGenContext} context
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
 * @param {import("../generated/common/types").CodeGenContext} context
 */
export function generateTypeFile(context) {
  const declareGlobal =
    context.options.declareGlobalTypes === false
      ? false
      : !context.options.useTypescript;

  const typeFile = js`
    ${[...context.types.rawImports]}
    ${
      context.options.useTypescript
        ? "// An export soo all things work correctly with linters, ts, ...\n  export const __generated__ = true;"
        : ""
    }

    ${!declareGlobal ? "" : "declare global {"}

    ${getMemoizedNamedTypes(context)}

    ${!declareGlobal ? "" : "}"}

  `;

  context.outputFiles.push({
    contents: typeFile,
    relativePath: `./common/types${
      context.options.useTypescript ? ".ts" : ".d.ts"
    }`,
  });
}

/**
 * @param {import("../generated/common/types").CodeGenContext} context
 * @param {CodeGenType} type
 * @param {CodeGenTypeSettings} settings
 */
export function generateTypeDefinition(
  context,
  type,
  {
    isJSON,
    useConvert,
    useDefaults,
    useTypescript,
    isCommonFile,
    isTypeFile,
    isNode,
    isBrowser,
    suffix,
    fileTypeIO,
  } = {},
) {
  const recurseSettings = {
    isJSON: isJSON || false,
    useConvert,
    useDefaults,
    useTypescript,
    isCommonFile,
    isTypeFile,
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
        if (type.rawValueImport.typeScript || type.rawValueImport.javaScript) {
          context.types.rawImports.add(
            type.rawValueImport.typeScript || type.rawValueImport.javaScript,
          );
        }
      } else {
        result += "any";
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

      if (type.validator.convert && useConvert) {
        result += "|(";
        result += generateTypeDefinition(context, type.values, recurseSettings);
        result += ")";
      }
      break;
    case "boolean":
      if (!isNil(type.oneOf)) {
        result += type.oneOf;

        if (type.validator.convert && useConvert) {
          result += `|"${type.oneOf}"`;
        }
      } else {
        result += `boolean`;

        if (type.validator.convert && useConvert) {
          result += `|"true"|"false"`;
        }
      }
      break;
    case "date":
      if (isBrowser || isJSON) {
        result += "string";
      } else if (type.specifier) {
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
        result += `{ size: number, filepath: string, originalFilename?: string, newFilename?: string, mimetype?: string, mtime?: Date, hashAlgorithm?: "sha1" | "md5" | "sha256", hash?: string }`;
      } else if (fileTypeIO === "outputClient" && isBrowser) {
        result += "Blob";
      } else if (fileTypeIO === "outputClient" && isNode) {
        result += "ReadableStream";
      } else {
        result += "unknown";
      }
      break;
    case "generic":
      if (Array.isArray(type.keys.oneOf)) {
        result += `{ [ key in `;
        result += generateTypeDefinition(context, type.keys, recurseSettings);
      } else if (Array.isArray(type.keys.reference?.oneOf)) {
        result += `{ [ K in `;
        result += generateTypeDefinition(context, type.keys, recurseSettings);
      } else {
        result += `{ [ key: `;
        result += generateTypeDefinition(context, type.keys, recurseSettings);
      }
      result += "]:";
      result += generateTypeDefinition(context, type.values, recurseSettings);
      result += "}";
      break;
    case "number":
      if (type.oneOf) {
        result += type.oneOf.join("|");

        if (useConvert && type.validator.convert) {
          result += `|"${type.oneOf.join(`"|"`)}"`;
        }
      } else {
        result += `number`;

        if (useConvert && type.validator.convert) {
          result += `|string`;
        }
      }

      break;
    case "object":
      result += "{";
      for (const key of Object.keys(type.keys)) {
        const right = generateTypeDefinition(
          context,
          type.keys[key],
          recurseSettings,
        );

        let separator = ":";
        // If right is a reference, it doesn't have to start with 'undefined'
        // So we need to manually check the reference as well
        if (
          right.startsWith("undefined|") ||
          (type.keys[key].reference?.isOptional &&
            (!useDefaults || isNil(type.keys[key].reference.defaultValue)))
        ) {
          separator = "?:";
        }

        result += `"${key}"${separator} ${right}, `;
      }
      result += "}";
      break;
    case "reference": {
      const typeName = getTypeNameForType(
        context,
        type.reference,
        suffix,
        recurseSettings,
      );

      if (context.options.declareGlobalTypes === false && !isTypeFile) {
        result += `import("./${
          isCommonFile ? "" : "../common/"
        }types").${typeName}`;
      } else {
        result += typeName;
      }

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
 * @param {import("../generated/common/types").CodeGenContext} context
 * @returns {string[]}
 */
function getMemoizedNamedTypes(context) {
  const result = [];
  const { useTypescript } = context.types.defaultSettings;
  const declareGlobal =
    context.options.declareGlobalTypes === false ? false : !useTypescript;
  const uniqueNameDocsMap = {};

  for (const value of structureIteratorNamedTypes(context.structure)) {
    if (value.docString && value.docString.length > 0) {
      uniqueNameDocsMap[upperCaseFirst(value.uniqueName)] = value.docString;
    }
  }

  for (const [name, type] of context.types.typeMap.entries()) {
    let intermediate = "";

    if (uniqueNameDocsMap[name]) {
      intermediate += `// ${uniqueNameDocsMap[name].replaceAll(
        "\n",
        "\n // ",
      )}\n`;
    }
    intermediate += `${!declareGlobal ? "export " : ""}type ${name} = `;
    intermediate += type;
    intermediate += `;`;

    result.push(intermediate);
  }

  return result;
}

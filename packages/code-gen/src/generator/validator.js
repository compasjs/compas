import { inspect } from "util";
import { isNil } from "@compas/stdlib";
import { TypeBuilder } from "../builders/index.js";
import { js } from "./tag/index.js";
import { generateTypeDefinition, getTypeNameForType } from "./types.js";
import { importCreator } from "./utils.js";

/**
 * @name ValidatorContext
 * @typedef {object}
 * @property {CodeGenContext} context
 * @property {boolean} collectErrors
 * @property {Map<string, number>} anonymousFunctionMapping
 * @property {string[]} anonymousFunctions
 * @property {Map<string, string>} objectSets
 */

/**
 * @name GeneratorBuildError
 * Calls generated buildError function to construct an error
 *
 * @typedef {function(key: string, info: string, errors: string=, errorsReturn:
 *   boolean=): string}
 */

/**
 * @type {GeneratorBuildError}
 */
let buildError = undefined;

/**
 * @param {CodeGenContext} context
 */
export function generateValidatorFile(context) {
  /**
   * @type {ValidatorContext}
   */
  const subContext = {
    context,
    collectErrors: !context.options.throwingValidators,
    anonymousFunctionMapping: new Map(),
    anonymousFunctions: [],
    objectSets: new Map(),
  };

  if (subContext.collectErrors) {
    buildError = (key, info, errors = "errors", errorsReturn = true) => js`
      ${errors}.push(buildError(parentType, "${key}", ${info}));
      ${errorsReturn ? "return undefined" : ""};
    `;
  } else {
    buildError = (key, info) => js`
      throw buildError(parentType, "${key}", ${info});
    `;
  }

  addUtilitiesToAnonymousFunctions(subContext);

  const imports = importCreator();
  const anonymousValidatorImports = importCreator();
  const rootExports = [];
  const validatorSources = [];

  for (const group of Object.keys(context.structure)) {
    const { exportNames, sources } = generateValidatorsForGroup(
      subContext,
      imports,
      anonymousValidatorImports,
      group,
    );

    rootExports.push(...exportNames);
    validatorSources.push(...sources);
  }

  const result = [
    anonymousValidatorImports.print(),
    ...subContext.objectSets.values(),
    ...subContext.anonymousFunctions,
  ];

  context.outputFiles.push({
    contents: result.join("\n"),
    relativePath: `./anonymous-validators${context.extension}`,
  });

  context.outputFiles.push({
    contents: js`
                               ${imports.print()}

                               ${validatorSources}
                             `,
    relativePath: `./validators${context.extension}`,
  });

  context.rootExports.push(
    `export { ${rootExports.join(",\n  ")} } from "./validators${
      context.importExtension
    }";`,
  );
}

/**
 * @param {ValidatorContext} context
 * @param {string} output
 * @returns {string}
 */
function withTypescript(context, output) {
  if (context.context.options.useTypescript) {
    return output ?? "";
  }
  return "";
}

/**
 *
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {ImportCreator} anonymousImports
 * @param {string} group
 * @returns {{ exportNames: string[], sources: string[] }}
 */
function generateValidatorsForGroup(context, imports, anonymousImports, group) {
  const data = context.context.structure[group];

  const mapping = {};
  const exportNames = [];
  const sources = [];

  for (const name of Object.keys(data)) {
    const type = data[name];

    if (["route", "relation"].indexOf(type.type) !== -1) {
      continue;
    }

    if (context.context.options.useTypescript) {
      imports.destructureImport(
        getTypeNameForType(context.context, data[name], "", {}),
        "./types",
      );
    }

    mapping[name] = createOrUseAnonymousFunction(
      context,
      anonymousImports,
      type,
    );
    imports.destructureImport(
      mapping[name],
      `./anonymous-validators${context.context.importExtension}`,
    );
    exportNames.push(`validate${type.uniqueName}`);
  }

  for (const name of Object.keys(mapping)) {
    sources.push(js`
      /**
       * ${data[name].docString ?? ""}
       * @param {${generateTypeDefinition(context.context, {
         type: "any",
         isOptional: true,
       })}} value
       * @param {string|undefined} [propertyPath]
       ${() => {
         if (context.collectErrors) {
           return `* @returns {{ data: ${getTypeNameForType(
             context.context,
             data[name],
             "",
             {},
           )} | undefined, errors: (*[])|undefined}}`;
         }
         return js`*
         @returns {
           ${getTypeNameForType(context.context, data[name], "", {})}
         }`;
       }}
       */
      export function validate${data[name].uniqueName}(value${withTypescript(
      context,
      ": any",
    )}, propertyPath = "$")

      ${withTypescript(
        context,
        `: { data: ${getTypeNameForType(
          context.context,
          data[name],
          "",
          {},
        )}, errors: undefined } | { data: undefined, errors: any[] }`,
      )}
      {

        ${() => {
          if (context.collectErrors) {
            return js`
              const errors${withTypescript(context, ": any[]")} = [];
              const data = ${mapping[name]}(value, propertyPath, errors);
              if (errors.length > 0) {
                return { data: undefined, errors };
              } else {
                return {
                  data${withTypescript(context, ": data!")}, errors: undefined
                };
              }
            `;
          }
          return js`
            return ${mapping[name]}(value, propertyPath, []);
          `;
        }}
      }
    `);
  }

  return {
    exportNames,
    sources,
  };
}

/**
 * @param {ValidatorContext} context
 */
function addUtilitiesToAnonymousFunctions(context) {
  context.anonymousFunctions.push(js`

    /**
     * @param {*} value
     * @returns {boolean}
     */
    export function isNil(value

    ${withTypescript(context, ": any")}
    )
    {
      return value === undefined || value === null;
    }

    /**
     * @name {ValidationErrorFn}
     * This function should not throw as the corresponding validator will do that
     * @typedef {function(string,any): Error}
     */
    ${withTypescript(
      context,
      "type ValidationErrorFn = (key: string, info: any) => any",
    )}

    /** @type {ValidationErrorFn} */
    let errorFn = (key${withTypescript(context, ": string")},
                   info${withTypescript(context, ": any")}
    ) => {
      const err
      ${withTypescript(
        context,
        ": any",
      )} = new Error(\`ValidationError: $\{key}\`);
      err.key = key;
      err.info = info;
      return err;
    };

    /**
     * @param {string} type
     * @param {string} key
     * @param {*} info
     */
    export function buildError(type${withTypescript(context, ": string")},
                               key${withTypescript(context, ": string")},
                               info

    ${withTypescript(context, ": any")}
    )
    {
      return errorFn(\`validator.$\{type}.$\{key}\`, info);
    }

    /**
     * Set a different error function, for example AppError.validationError
     * @param {ValidationErrorFn} fn
     */
    export function validatorSetError(fn${withTypescript(
      context,
      ": ValidationErrorFn",
    )}) {
      errorFn = fn;
    }
  `);

  context.context.rootExports.push(
    `export { validatorSetError } from "./anonymous-validators${context.context.importExtension}";`,
  );
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenType} type
 * @param {string} valueString
 * @param {string} propertyPath
 * @param {string} errors
 * @param {string} prefix
 * @param {string=} parentType
 * @returns {string}
 */
function generateAnonymousValidatorCall(
  context,
  imports,
  type,
  valueString,
  propertyPath,
  errors,
  prefix,
  parentType,
) {
  const inlineCall = createInlineValidator(
    context,
    imports,
    type,
    valueString,
    propertyPath,
    errors,
    prefix,
  );

  if (inlineCall !== undefined) {
    return inlineCall;
  }

  const anonFn = createOrUseAnonymousFunction(context, imports, type);

  return `${prefix} ${anonFn}(${valueString}, ${propertyPath}, ${errors} ${
    parentType ? `, ${parentType}` : ""
  });`;
}

/**
 * Get hash for any object, for max 18 properties deep.
 * Used to have stable output of unchanged validators
 *
 * @param {object} type
 * @returns {number}
 */
function getHashForType(type) {
  const string = inspect(type, { colors: false, depth: 18 });

  let hash = 0;
  let i = 0;
  const len = string.length;
  while (i < len) {
    hash = ((hash << 5) - hash + string.charCodeAt(i++)) << 0;
  }
  hash = Math.abs(hash);

  return hash;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenType} type
 */
function createOrUseAnonymousFunction(context, imports, type) {
  const string = inspect(type, { colors: false, depth: 18 });

  // Function for this type already exists
  if (context.anonymousFunctionMapping.has(string)) {
    return `anonymousValidator${context.anonymousFunctionMapping.get(string)}`;
  }

  const hash = getHashForType(type);

  const name = `anonymousValidator${hash}`;

  context.anonymousFunctionMapping.set(string, hash);

  const fn = js`
    /**
     * @param {*} value
     * @param {string} propertyPath
     * @param {*[]} errors
     * @param {string} parentType
     * @returns {${generateTypeDefinition(context.context, type, {
       useDefaults: true,
     })}|undefined}
     */
    export function anonymousValidator${hash}(value${withTypescript(
    context,
    ": any",
  )},
                                              propertyPath${withTypescript(
                                                context,
                                                ": string",
                                              )},
                                              errors${withTypescript(
                                                context,
                                                ": any[]",
                                              )} = [],
                                              parentType${withTypescript(
                                                context,
                                                ": string",
                                              )} = "${type.type}",
    ) {
      if (isNil(value)) {
        ${() => {
          if (type.isOptional && type.defaultValue) {
            return `return ${type.defaultValue}`;
          } else if (type.isOptional) {
            return `return value`;
          }

          return buildError("undefined", "{ propertyPath }");
        }}
      }
      ${anonymousValidatorForType(context, imports, type)}
    }
  `;

  context.anonymousFunctions.push(fn);

  return name;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenType} type
 */
function anonymousValidatorForType(context, imports, type) {
  switch (type.type) {
    case "any":
      return anonymousValidatorAny(context, imports, type);
    case "anyOf":
      return anonymousValidatorAnyOf(context, imports, type);
    case "array":
      return anonymousValidatorArray(context, imports, type);
    case "boolean":
      return anonymousValidatorBoolean(context, imports, type);
    case "date":
      return anonymousValidatorDate(context, imports);
    case "file":
      // TODO: Implement for possible locations
      return `return value;`;
    case "generic":
      return anonymousValidatorGeneric(context, imports, type);
    case "number":
      return anonymousValidatorNumber(context, imports, type);
    case "object":
      return anonymousValidatorObject(context, imports, type);
    case "reference":
      return anonymousValidatorReference(context, imports, type);
    case "string":
      return anonymousValidatorString(context, imports, type);
    case "uuid":
      return anonymousValidatorUuid(context, imports);
  }
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenAnyType} type
 */
function anonymousValidatorAny(context, imports, type) {
  if (isNil(type.rawValidator)) {
    return `return value;`;
  }

  if (
    !isNil(type.rawValidatorImport.typeScript) &&
    context.context.options.useTypescript
  ) {
    imports.rawImport(type.rawValidatorImport.typeScript);
  } else if (
    !isNil(type.rawValidatorImport.javaScript) &&
    !context.context.options.useTypescript
  ) {
    imports.rawImport(type.rawValidatorImport.javaScript);
  }

  return js`
    if (!${type.rawValidator}(value)) {
      ${buildError("custom", "{ propertyPath }")}
    }
    return value;
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenAnyOfType} type
 */
function anonymousValidatorAnyOf(context, imports, type) {
  return js`
    const subErrors${withTypescript(context, ": any[]")} = [];

    ${
      context.collectErrors
        ? `
    let errorCount = 0;
    let result = undefined;
    `
        : ""
    }

    ${type.values.map((it) => {
      // Only returns the first error for anyOf types
      if (context.collectErrors) {
        return js`
          ${generateAnonymousValidatorCall(
            context,
            imports,
            it,
            "value",
            "propertyPath",
            "subErrors",
            "result = ",
          )}

          if (subErrors.length === errorCount) {
            return result;
          }
          subErrors.splice(errorCount + 1, subErrors.length - errorCount);
          errorCount = subErrors.length;
        `;
      }
      return js`
        try {
          ${generateAnonymousValidatorCall(
            context,
            imports,
            it,
            "value",
            "propertyPath",
            "subErrors",
            "return ",
          )}
        } catch (e) {
          subErrors.push(e);
        }
      `;
    })}

    ${buildError("type", "{ propertyPath, errors: subErrors }")}
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenArrayType} type
 */
function anonymousValidatorArray(context, imports, type) {
  return js`
    ${() => {
      if (type.validator.convert) {
        return js`
          if (!Array.isArray(value)) {
            value = [ value ];
          }
        `;
      }
    }}

    if (!Array.isArray(value)) {
      ${buildError("type", "{ propertyPath }")}
    }


    ${() => {
      if (!isNil(type.validator.min)) {
        return js`
          if (value.length < ${type.validator.min}) {
            const min = ${type.validator.min};
            ${buildError("min", "{ propertyPath, min }")}
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.max)) {
        return js`
          if (value.length > ${type.validator.max}) {
            const max = ${type.validator.max};
            ${buildError("max", "{ propertyPath, max }")}
          }
        `;
      }
    }}

    const result = Array.from({ length: value.length });
    for (let i = 0; i < value.length; ++i) {
      ${generateAnonymousValidatorCall(
        context,
        imports,
        type.values,
        `value[i]`,
        `propertyPath + "[" + i + "]"`,
        "errors",
        `result[i] =`,
      )}
    }

    return result;
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenBooleanType} type
 */
function anonymousValidatorBoolean(context, imports, type) {
  return js`
    ${() => {
      if (type.validator.convert) {
        return js`
          if (typeof value !== "boolean") {
            if (value === "true" || value === 1) {
              value = true;
            } else if (value === "false" || value === 0) {
              value = false;
            }
          }
        `;
      }
    }}

    if (typeof value !== "boolean") {
      ${buildError("type", "{ propertyPath }")}
    }

    ${() => {
      if (type.oneOf !== undefined) {
        return js`
          if (value !== ${type.oneOf}) {
            const oneOf = ${type.oneOf};
            ${buildError("oneOf", "{ propertyPath, oneOf }")}
          }
        `;
      }
    }}

    return value;
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 */
function anonymousValidatorDate(context, imports) {
  const stringType = {
    ...TypeBuilder.getBaseData(),
    type: "string",
    validator: {
      min: 24,
      max: 29,
      pattern:
        "/^(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))$/gi",
    },
  };

  return js`
    if (typeof value === "string") {
      ${generateAnonymousValidatorCall(
        context,
        imports,
        stringType,
        "value",
        "propertyPath",
        "errors",
        "value =",
        `"date"`,
      )}
    }
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch {
      ${buildError("invalid", "{ propertyPath }")}
    }

    ${buildError("invalid", "{ propertyPath }")}
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenGenericType} type
 */
function anonymousValidatorGeneric(context, imports, type) {
  return js`
    if (typeof value !== "object") {
      ${buildError("type", "{ propertyPath }")}
    }

    const result = Object.create(null);
    for (const key of Object.keys(value)) {
      ${generateAnonymousValidatorCall(
        context,
        imports,
        type.keys,
        "key",
        `propertyPath + ".$key[" + key + "]"`,
        "errors",
        `const genericKey = `,
      )}
      if (genericKey !== undefined) {
        ${generateAnonymousValidatorCall(
          context,
          imports,
          type.values,
          "value[key]",
          `propertyPath + ".$value[" + key + "]"`,
          "errors",
          `result[genericKey] = `,
        )}
      }
    }

    return result;
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenNumberType} type
 */
function anonymousValidatorNumber(context, imports, type) {
  return js`
    ${() => {
      if (type.validator.convert) {
        return js`
          if (typeof value !== "number") {
            value = Number(value);
          }
        `;
      }
    }}

    if (typeof value !== "number" || isNaN(value) || !isFinite(value)) {
      ${buildError("type", "{ propertyPath }")}
    }

    ${() => {
      if (!type.validator.floatingPoint) {
        return js`
          if (!Number.isInteger(value)) {
            ${buildError("integer", "{ propertyPath }")}
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.min)) {
        return js`
          if (value < ${type.validator.min}) {
            const min = ${type.validator.min};
            ${buildError("min", "{ propertyPath, min }")}
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.max)) {
        return js`
          if (value > ${type.validator.max}) {
            const max = ${type.validator.max};
            ${buildError("max", "{ propertyPath, max }")}
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.oneOf)) {
        return js`
          if (${type.oneOf.map((it) => `value !== ${it}`).join(" && ")}) {
            const oneOf = [ ${type.oneOf.join(", ")} ];
            ${buildError("oneOf", "{ propertyPath, oneOf }")}
          }
        `;
      }
    }}

    return value;
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function anonymousValidatorObject(context, imports, type) {
  const hash = getHashForType(type);
  if (type.validator.strict && !context.objectSets.has(hash)) {
    context.objectSets.set(
      hash,
      `const objectKeys${hash} = new Set(["${Object.keys(type.keys).join(
        `", "`,
      )}"])`,
    );
  }

  return js`
    if (typeof value !== "object") {
      ${buildError("type", "{ propertyPath }")}
    }

    const result = Object.create(null);

    ${() => {
      // Setup a keySet, so we can error when extra keys are present
      if (type.validator.strict) {
        return js`
          for (const key of Object.keys(value)) {
            if (!objectKeys${hash}.has(key)) {
              ${buildError("strict", "{ propertyPath, extraKey: key }")}
            }
          }
        `;
      }
    }}

    ${() => {
      return Object.keys(type.keys).map((it) => {
        return js`
          ${generateAnonymousValidatorCall(
            context,
            imports,
            type.keys[it],
            `value["${it}"]`,
            `propertyPath + ".${it}"`,
            "errors",
            `result["${it}"]= `,
          )}
        `;
      });
    }}

    return result;
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenReferenceType} type
 */
function anonymousValidatorReference(context, imports, type) {
  return generateAnonymousValidatorCall(
    context,
    imports,
    type.reference,
    "value",
    "propertyPath",
    "errors",
    "return ",
  );
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenStringType} type
 */
function anonymousValidatorString(context, imports, type) {
  return js`
    ${() => {
      if (type.validator.convert) {
        return js`
          if (typeof value !== "string") {
            value = String(value);
          }
        `;
      }
    }}

    if (typeof value !== "string") {
      ${buildError("type", "{ propertyPath }")}
    }

    ${() => {
      if (type.validator.trim) {
        return js`
          value = value.trim();
        `;
      }
    }}

    ${() => {
      // Special case to default to undefined on empty & optional strings
      if (type.isOptional && type.defaultValue) {
        return js`
          if (value.length === 0) {
            return ${type.defaultValue};
          }
        `;
      } else if (type.isOptional) {
        return js`
          if (value.length === 0) {
            return ${type.validator?.allowNull ? "null" : "undefined"};
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.min)) {
        return js`
          if (value.length < ${type.validator.min}) {
            const min = ${type.validator.min};
            ${buildError("min", "{ propertyPath, min }")}
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.max)) {
        return js`
          if (value.length > ${type.validator.max}) {
            const max = ${type.validator.max};
            ${buildError("max", "{ propertyPath, max }")}
          }
        `;
      }
    }}

    ${() => {
      if (type.validator.upperCase) {
        return js`
          value = value.toUpperCase();
        `;
      }
    }}

    ${() => {
      if (type.validator.lowerCase) {
        return js`
          value = value.toLowerCase();
        `;
      }
    }}

    ${() => {
      if (!isNil(type.oneOf)) {
        return js`
          if (${type.oneOf.map((it) => `value !== "${it}"`).join(" && ")}) {
            const oneOf = [ "${type.oneOf.join('", "')}" ];
            ${buildError("oneOf", "{ propertyPath, oneOf }")}
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.pattern)) {
        return js`
          if (!${type.validator.pattern}.test(value)) {
            ${buildError("pattern", "{ propertyPath }")}
          }
        `;
      }
    }}

    return value;
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 */
function anonymousValidatorUuid(context, imports) {
  const stringType = {
    ...TypeBuilder.baseData,
    type: "string",
    validator: {
      min: 36,
      max: 36,
      lowerCase: true,
      trim: true,
      pattern:
        "/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$/gi",
    },
  };

  return generateAnonymousValidatorCall(
    context,
    imports,
    stringType,
    "value",
    "propertyPath",
    "errors",
    "return ",
    `"uuid"`,
  );
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenType} type
 * @param {string} valueString
 * @param {string} propertyPath
 * @param {string} errors
 * @param {string} prefix
 * @returns {string}
 */
function createInlineValidator(
  context,
  imports,
  type,
  valueString,
  propertyPath,
  errors,
  prefix,
) {
  // Just don't deal with default values
  if (type.isOptional && !isNil(type.defaultValue)) {
    return undefined;
  }

  // Don't deal with nullable types, and converting values
  if (type.validator?.allowNull || type.validator?.convert) {
    return undefined;
  }

  switch (type.type) {
    case "any":
      return inlineValidatorAny(
        context,
        imports,
        type,
        valueString,
        propertyPath,
        errors,
        prefix,
      );
    case "anyOf":
      break;
    case "array":
      break;
    case "boolean":
      return inlineValidatorBoolean(
        context,
        imports,
        type,
        valueString,
        propertyPath,
        errors,
        prefix,
      );
    case "file":
      break;
    case "generic":
      break;
    case "number":
      return inlineValidatorNumber(
        context,
        imports,
        type,
        valueString,
        propertyPath,
        errors,
        prefix,
      );
    case "object":
      break;
    case "reference":
      return inlineValidatorReference(
        context,
        imports,
        type,
        valueString,
        propertyPath,
        errors,
        prefix,
      );
    case "string":
      return inlineValidatorString(
        context,
        imports,
        type,
        valueString,
        propertyPath,
        errors,
        prefix,
      );
  }

  return undefined;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenAnyType} type
 * @param {string} valueString
 * @param {string} propertyPath
 * @param {string} errors
 * @param {string} prefix
 * @returns {string}
 */
function inlineValidatorAny(
  context,
  imports,
  type,
  valueString,
  propertyPath,
  errors,
  prefix,
) {
  if (isNil(type.rawValidator) && type.isOptional) {
    return js`
      ${`${prefix} ${valueString}`} ?? undefined;
    `;
  }

  if (isNil(type.rawValidator) && !type.isOptional) {
    return js`
      if (isNil(${valueString})) {
        const parentType = "any";
        ${buildError(
          "undefined",
          `{ propertyPath: ${propertyPath} }`,
          errors,
          false,
        )}
      }
      ${`${prefix} ${valueString}`}
    `;
  }

  if (
    !isNil(type.rawValidatorImport.typeScript) &&
    context.context.options.useTypescript
  ) {
    imports.rawImport(type.rawValidatorImport.typeScript);
  } else if (
    !isNil(type.rawValidatorImport.javaScript) &&
    !context.context.options.useTypescript
  ) {
    imports.rawImport(type.rawValidatorImport.javaScript);
  }

  return js`
    if (${
      type.isOptional
        ? `!isNil(${valueString}) && `
        : `isNil(${valueString}) ||`
    }!${type.rawValidator}(
      ${valueString})
    )
    {
      const parentType = "any";
      ${buildError(
        "custom",
        `{ propertyPath: ${propertyPath} }`,
        errors,
        false,
      )}
    }
    ${`${prefix} ${valueString}`} ?? undefined;
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenBooleanType} type
 * @param {string} valueString
 * @param {string} propertyPath
 * @param {string} errors
 * @param {string} prefix
 * @returns {string}
 */
function inlineValidatorBoolean(
  context,
  imports,
  type,
  valueString,
  propertyPath,
  errors,
  prefix,
) {
  if (type.validator.convert) {
    return undefined;
  }

  if (!isNil(type.oneOf)) {
    return js`
      if (${
        type.isOptional
          ? `!isNil(${valueString}) && `
          : `isNil(${valueString}) ||`
      }${valueString} !==
        ${type.oneOf}) {
        const parentType = "boolean";
        ${buildError(
          "oneOf",
          `{ propertyPath: ${propertyPath}, oneOf: ${type.oneOf} }`,
          errors,
          false,
        )}
      }
      ${`${prefix} ${valueString}`} ?? undefined;
    `;
  }

  return js`
    if (${
      type.isOptional
        ? `!isNil(${valueString}) && `
        : `isNil(${valueString}) ||`
    }typeof ${valueString} !== "boolean"
    )
    {
      const parentType = "boolean";
      ${buildError("type", `{ propertyPath: ${propertyPath} }`, errors, false)}
    }
    ${`${prefix} ${valueString}`} ?? undefined;
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenReferenceType} type
 * @param {string} valueString
 * @param {string} propertyPath
 * @param {string} errors
 * @param {string} prefix
 * @returns {string}
 */
function inlineValidatorReference(
  context,
  imports,
  type,
  valueString,
  propertyPath,
  errors,
  prefix,
) {
  if (!type.isOptional || (type.isOptional && type.reference.isOptional)) {
    return generateAnonymousValidatorCall(
      context,
      imports,
      type.reference,
      valueString,
      propertyPath,
      errors,
      prefix,
    );
  }
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenNumberType} type
 * @param {string} valueString
 * @param {string} propertyPath
 * @param {string} errors
 * @param {string} prefix
 * @returns {string}
 */
function inlineValidatorNumber(
  context,
  imports,
  type,
  valueString,
  propertyPath,
  errors,
  prefix,
) {
  if (type.validator.convert || type.validator.floatingPoint) {
    return;
  }

  if (isNil(type.oneOf)) {
    return;
  }

  const oneOfArray = [...type.oneOf.map((it) => `${it}`)];
  if (type.isOptional) {
    oneOfArray.push("undefined", "null");
  }

  return js`
    if (${oneOfArray.map((it) => `${valueString} !== ${it}`).join(" && ")}) {
      const parentType = "number";
      const oneOf = [ ${type.oneOf.join(", ")} ];
      ${buildError(
        "oneOf",
        `{ propertyPath: ${propertyPath}, oneOf }`,
        errors,
        false,
      )}
    }
    ${`${prefix} ${valueString}`} ?? undefined;
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenStringType} type
 * @param {string} valueString
 * @param {string} propertyPath
 * @param {string} errors
 * @param {string} prefix
 * @returns {string}
 */
function inlineValidatorString(
  context,
  imports,
  type,
  valueString,
  propertyPath,
  errors,
  prefix,
) {
  if (
    type.validator.trim ||
    type.validator.upperCase ||
    type.validator.lowerCase ||
    type.validator.pattern ||
    type.validator.convert
  ) {
    return;
  }

  if (isNil(type.oneOf)) {
    return;
  }

  const oneOfArray = [...type.oneOf.map((it) => `"${it}"`)];
  if (type.isOptional) {
    oneOfArray.push("undefined", "null");
  }

  return js`
    if (${oneOfArray.map((it) => `${valueString} !== ${it}`).join(" && ")}) {
      const parentType = "string";
      const oneOf = [ "${type.oneOf.join('", "')}" ];
      ${buildError(
        "oneOf",
        `{ propertyPath: ${propertyPath}, oneOf }`,
        errors,
        false,
      )}
    }
    ${`${prefix} ${valueString}`} ?? undefined;
  `;
}

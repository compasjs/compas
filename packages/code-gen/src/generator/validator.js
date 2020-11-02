import { inspect } from "util";
import { isNil } from "@lbu/stdlib";
import { TypeBuilder } from "../builders/index.js";
import { js } from "./tag/index.js";
import { generateTypeDefinition, getTypeNameForType } from "./types.js";
import { importCreator } from "./utils.js";

/**
 * @name ValidatorContext
 * @typedef {object}
 * @property {CodeGenContext} context
 * @property {boolean} collectErrors
 * @property {number} anonymousFunctionIdx
 * @property {Map<string, number>} anonymousFunctionMapping
 * @property {string[]} anonymousFunctions
 */

/**
 * @param {CodeGenContext} context
 */
export function generateValidatorFile(context) {
  /**
   * @type {ValidatorContext}
   */
  const subContext = {
    context,
    collectErrors: !context.options.isNodeServer,
    anonymousFunctionIdx: 0,
    anonymousFunctionMapping: new Map(),
    anonymousFunctions: [],
  };

  addUtilitiesToAnonymousFunctions(subContext);

  const imports = importCreator();
  const rootExports = [];
  const validatorSources = [];

  for (const group of Object.keys(context.structure)) {
    const { exportNames, sources } = generateValidatorsForGroup(
      subContext,
      imports,
      group,
    );

    rootExports.push(...exportNames);
    validatorSources.push(...sources);
  }

  context.outputFiles.push({
    contents: subContext.anonymousFunctions.join("\n"),
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
 * @param {string} group
 * @returns {{ exportNames: string[], sources: string[] }}
 */
export function generateValidatorsForGroup(context, imports, group) {
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

    mapping[name] = createOrUseAnonymousFunction(context, imports, type, true);
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
      export function validate${data[name].uniqueName}(
        value${withTypescript(context, ": any")},
        propertyPath = "$"
      )

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
        const errors${withTypescript(context, ": any[]")} = [];
        const data = ${mapping[name]}(value, propertyPath, errors);

        ${() => {
          if (context.collectErrors) {
            return js`
              if (errors.length > 0) {
                return { data: undefined, errors };
              } else {
                return { data${withTypescript(
                  context,
                  ": data!",
                )}, errors: undefined };
              }
            `;
          }
          return js`
            if (errors.length > 0) {
              throw errors[0];
            } else {
              return data;
            }
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
 * @param {boolean} [isTypeRoot=false]
 */
export function createOrUseAnonymousFunction(
  context,
  imports,
  type,
  isTypeRoot = false,
) {
  const string = inspect(type, { colors: false, depth: 15 });

  // Function for this type already exists
  if (context.anonymousFunctionMapping.has(string)) {
    const name = `anonymousValidator${context.anonymousFunctionMapping.get(
      string,
    )}`;
    if (isTypeRoot) {
      imports.destructureImport(
        name,
        `./anonymous-validators${context.context.importExtension}`,
      );
    }
    return name;
  }

  const idx = context.anonymousFunctionIdx++;
  const name = `anonymousValidator${idx}`;

  context.anonymousFunctionMapping.set(string, idx);
  if (isTypeRoot) {
    imports.destructureImport(
      name,
      `./anonymous-validators${context.context.importExtension}`,
    );
  }

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
    export function anonymousValidator${idx}(value${withTypescript(
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
      // TODO: Implement custom imports?
      return `return value;`;
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
 * @param {CodeGenAnyOfType} type
 */
function anonymousValidatorAnyOf(context, imports, type) {
  return js`
    let errorCount = 0;
    const subErrors${withTypescript(context, ": any[]")} = [];
    let result = undefined;

    ${type.values.map((it) => {
      const validator = createOrUseAnonymousFunction(context, imports, it);

      // Only returns the first error for anyOf types
      return js`
        result = ${validator}(value, propertyPath, subErrors);
        if (subErrors.length === errorCount) {
          return result;
        }
        subErrors.splice(errorCount + 1, subErrors.length - errorCount);
        errorCount = subErrors.length;
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
  const validator = createOrUseAnonymousFunction(context, imports, type.values);
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

    const result = [];
    for (let i = 0; i < value.length; ++i) {
      result.push(${validator}(value[i], propertyPath + "[" + i + "]", errors));
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
  const validator = createOrUseAnonymousFunction(context, imports, {
    ...TypeBuilder.getBaseData(),
    type: "string",
    validator: {
      min: 24,
      max: 29,
      pattern:
        "/^(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))$/gi",
    },
  });

  return js`
    if (typeof value === "string") {
      value = ${validator}(value, propertyPath, errors, parentType);
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
  const keyValidator = createOrUseAnonymousFunction(
    context,
    imports,
    type.keys,
  );
  const valueValidator = createOrUseAnonymousFunction(
    context,
    imports,
    type.values,
  );

  return js`
    if (typeof value !== "object") {
      ${buildError("type", "{ propertyPath }")}
    }

    const result = Object.create(null);
    for (const key of Object.keys(value)) {
      const genericKey = ${keyValidator}(key, propertyPath + ".$key[" + key + "]", errors);
      if (genericKey !== undefined) { 
       result[genericKey] = ${valueValidator}(value[key], propertyPath + ".$value[" + key + "]", errors);
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
  return js`
    if (typeof value !== "object") {
      ${buildError("type", "{ propertyPath }")}
    }

    const result = Object.create(null);

    ${() => {
      // Setup a keySet, so we can error when extra keys are present
      if (type.validator.strict) {
        return js`const keySet = new Set(Object.keys(value));`;
      }
    }}

    ${() => {
      return Object.keys(type.keys).map((it) => {
        const validator = createOrUseAnonymousFunction(
          context,
          imports,
          type.keys[it],
        );

        return js`
          result["${it}"] = ${validator}(value["${it}"], propertyPath + ".${it}", errors);

          ${() => {
            if (type.validator.strict) {
              return js`keySet.delete("${it}")`;
            }
          }}
        `;
      });
    }}

    ${() => {
      if (type.validator.strict) {
        return js`
          if (keySet.size !== 0) {
            const extraKeys = [ ...keySet ];
            ${buildError("strict", "{ propertyPath, extraKeys }")}
          }
        `;
      }
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
  const validator = createOrUseAnonymousFunction(
    context,
    imports,
    type.reference,
  );
  return js`
    return ${validator}(value, propertyPath, errors);
  `;
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
  const validator = createOrUseAnonymousFunction(context, imports, {
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
  });

  return js`
    return ${validator}(value, propertyPath, errors, parentType);
  `;
}

function buildError(key, info) {
  return js`
    errors.push(buildError(parentType, "${key}", ${info}));
    return undefined;
  `;
}

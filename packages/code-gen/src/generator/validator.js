// @ts-nocheck

import { isNil } from "@compas/stdlib";
import { TypeBuilder } from "../builders/index.js";
import { stringifyType } from "../stringify.js";
import { js } from "./tag/index.js";
import { generateTypeDefinition, getTypeNameForType } from "./types.js";
import { importCreator } from "./utils.js";

/**
 * @typedef {import("./utils").ImportCreator} ImportCreator
 */

/**
 * @typedef {object} ValidatorContext
 * @property {CodeGenContext} context
 * @property {Map<string, number>} anonymousFunctionMapping
 * @property {string[]} anonymousFunctions
 * @property {Map<string, string>} objectSets
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
    anonymousFunctionMapping: new Map(),
    anonymousFunctions: [],
    objectSets: new Map(),
  };

  const anonymousValidatorImports = importCreator();
  anonymousValidatorImports.destructureImport("isNil", "@compas/stdlib");

  for (const group of Object.keys(context.structure)) {
    const imports = importCreator();
    imports.destructureImport("isNil", "@compas/stdlib");
    imports.destructureImport("AppError", "@compas/stdlib");

    const { sources } = generateValidatorsForGroup(
      subContext,
      imports,
      anonymousValidatorImports,
      group,
    );

    context.outputFiles.push({
      contents: js`${imports.print()}
                                  ${sources}`,
      relativePath: `./${group}/validators${context.extension}`,
    });
  }

  const result = [
    anonymousValidatorImports.print(),
    `
    /**
     * @typedef {{
     *   propertyPath: string,
     *   key: string,
     *   info: any,
     * }} InternalError
     */
     
     /**
      * @template T
      * @typedef {import("@compas/stdlib").EitherN<T, InternalError>} EitherN
      */
     `,

    ...subContext.objectSets.values(),
    ...subContext.anonymousFunctions,
  ];

  context.outputFiles.push({
    contents: result.join("\n"),
    relativePath: `./common/anonymous-validators${context.extension}`,
  });
}

/**
 *
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {ImportCreator} anonymousImports
 * @param {string} group
 * @returns {{ sources: string[] }}
 */
function generateValidatorsForGroup(context, imports, anonymousImports, group) {
  const data = context.context.structure[group];

  const mapping = {};
  const sources = [];

  for (const name of Object.keys(data)) {
    const type = data[name];

    if (["route", "relation"].indexOf(type.type) !== -1) {
      continue;
    }

    if (context.context.options.useTypescript) {
      imports.destructureImport(
        getTypeNameForType(context.context, data[name], "", {}),
        "../common/types",
      );
    }

    mapping[name] = createOrUseAnonymousFunction(
      context,
      anonymousImports,
      type,
    );
    imports.destructureImport(
      mapping[name],
      `../common/anonymous-validators${context.context.importExtension}`,
    );
  }

  sources.push(`
    /**
     * @template T
     * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
     */
  `);

  for (const name of Object.keys(mapping)) {
    sources.push(js`
      /**${
        data[name].docString && data[name].docString.length > 0
          ? `\n * ${data[name].docString}\n *`
          : ""
      }
       * @param {${generateTypeDefinition(context.context, {
         type: "any",
         isOptional: true,
       })}} value
       * @param {string|undefined} [propertyPath]
       * @returns {Either<${getTypeNameForType(
         context.context,
         data[name],
         "",
         {},
       )}>}
       */
      export function validate${
        data[name].uniqueName
      }(value, propertyPath = "$") {
        const result = ${mapping[name]}(value, propertyPath);
        if (result.errors) {
          const info = {};
          for (const err of result.errors) {
            if (isNil(info[err.propertyPath])) {
              info[err.propertyPath] = err;
            } else if (Array.isArray(info[err.propertyPath])) {
              info[err.propertyPath].push(err);
            } else {
              info[err.propertyPath] = [ info[err.propertyPath], err ];
            }
          }
          /** @type {{ error: AppError }} */
          return {
            error: AppError.validationError("validator.error", info),
          };
        }
        
        /** @type {{ value: ${getTypeNameForType(
          context.context,
          data[name],
          "",
          {},
        )}}} */
        return { value: result.value };
      }
    `);
  }

  return {
    sources,
  };
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenType} type
 * @param {string} valueString
 * @param {string} propertyPath
 * @param {string} prefix
 * @returns {string}
 */
function generateAnonymousValidatorCall(
  context,
  imports,
  type,
  valueString,
  propertyPath,
  prefix,
) {
  const inlineCall = createInlineValidator(
    context,
    imports,
    type,
    valueString,
    propertyPath,
    prefix,
  );

  if (!isNil(inlineCall)) {
    return inlineCall;
  }

  const anonFn = createOrUseAnonymousFunction(context, imports, type);

  return `${prefix} ${anonFn}(${valueString}, ${propertyPath});`;
}

/**
 * Get hash for any object, for max 18 properties deep.
 * Used to have stable output of unchanged validators
 *
 * @param {string|Record<string, any>} type
 * @returns {number}
 */
function getHashForType(type) {
  const string = typeof type === "string" ? type : stringifyType(type);

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
  const string = stringifyType(type);

  // Function for this type already exists
  if (context.anonymousFunctionMapping.has(string)) {
    return `anonymousValidator${context.anonymousFunctionMapping.get(string)}`;
  }

  const hash = getHashForType(string);

  const name = `anonymousValidator${hash}`;

  context.anonymousFunctionMapping.set(string, hash);

  const fn = js`
    /**
     * @param {*} value
     * @param {string} propertyPath
     * @returns {EitherN<${generateTypeDefinition(context.context, type, {
       useDefaults: true,
     })}>}
     */
    export function anonymousValidator${hash}(value, propertyPath) {
      if (isNil(value)) {
        ${() => {
          if (type.isOptional && !isNil(type.defaultValue)) {
            return `return { value: ${type.defaultValue} };`;
          } else if (type.isOptional) {
            return `return { value: ${
              type.validator?.allowNull ? "value" : undefined
            } };`;
          }

          return `
              /** @type {{ errors: InternalError[] }} */
              return {
                errors: [{
                  propertyPath,
                  key: "validator.${type.type}.undefined",
                  info: {},
                }],
              };`;
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
      return anonymousValidatorDate(context, imports, type);
    case "file":
      return anonymousValidatorFile(context, imports, type);
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
    default:
      return `
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.${type.type}.invalidValidator",
            info: {
              uniqueName: "${type.uniqueName}",
            }
          }
        ]
      };`;
  }
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenAnyType} type
 */
function anonymousValidatorAny(context, imports, type) {
  if (isNil(type.rawValidator)) {
    return `return { value };`;
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
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath, key: "validator.any.custom", info: {},
          }
        ]
      };
    }

    return { value };
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenAnyOfType} type
 */
function anonymousValidatorAnyOf(context, imports, type) {
  return js`
    let errors = [];

    /** @type {EitherN<${generateTypeDefinition(context.context, type, {
      useDefaults: true,
    })}>} */
    let result = { errors: [] };

    ${type.values.map((it) => {
      return js`
        ${generateAnonymousValidatorCall(
          context,
          imports,
          it,
          "value",
          "propertyPath",
          "result = ",
        )}

        if (result.errors) {
          errors.push(...result.errors);
        } else {
          return result;
        }
      `;
    })}

    const info = {};
    for (const err of errors) {
      if (isNil(info[err.propertyPath])) {
        info[err.propertyPath] = err;
      } else if (Array.isArray(info[err.propertyPath])) {
        info[err.propertyPath].push(err);
      } else {
        info[err.propertyPath] = [ info[err.propertyPath], err ];
      }
    }

    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath, key: "validator.anyOf", info,
        }
      ]
    };
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
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath, key: "validator.array.type", info: {},
          }
        ],
      };
    }


    ${() => {
      if (!isNil(type.validator.min)) {
        return js`
          if (value.length < ${type.validator.min}) {
            const min = ${type.validator.min};
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.array.min", info: { min },
                }
              ],
            };
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.max)) {
        return js`
          if (value.length > ${type.validator.max}) {
            const max = ${type.validator.max};
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.array.max", info: { max },
                }
              ],
            };
          }
        `;
      }
    }}

    const result = Array.from({ length: value.length });
    let errors = [];
    for (let i = 0; i < value.length; ++i) {
      ${generateAnonymousValidatorCall(
        context,
        imports,
        type.values,
        `value[i]`,
        `propertyPath + "[" + i + "]"`,
        `const arrVar = `,
      )}

      if (arrVar.errors) {
        errors.push(...arrVar.errors);
      } else {
        result[i] = arrVar.value;
      }
    }

    if (errors.length > 0) {
      /** @type {{ errors: InternalError[] }} */
      return { errors, };
    }


    return { value: result };
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
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath, key: "validator.boolean.type", info: {},
          }
        ],
      };
    }

    ${() => {
      if (type.oneOf !== undefined) {
        return js`
          if (value !== ${type.oneOf}) {
            const oneOf = ${type.oneOf};
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.boolean.oneOf", info: { oneOf },
                }
              ],
            };
          }
        `;
      }
    }}

    return { value };
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenDateType} type
 */
function anonymousValidatorDate(context, imports, type) {
  const stringType = {
    ...TypeBuilder.getBaseData(),
    type: "string",
    isOptional: type.isOptional,
    validator: {
      allowNull: type.validator.allowNull,
      min: 24,
      max: 29,
      pattern:
        "/^(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))$/gi",
    },
  };

  return js`
    if (typeof value !== "string" && typeof value !== "number" &&
      !(value instanceof Date)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath, key: "validator.date.invalid", info: {},
          }
        ]
      };
    }
    
    let date = new Date(value);

    if (typeof value === "string") {
      ${generateAnonymousValidatorCall(
        context,
        imports,
        stringType,
        "value",
        "propertyPath",
        "value =",
      )}
      
      if (value.errors) {
        return value;
      }

      ${
        type.isOptional && !isNil(type.defaultValue)
          ? `if (!value.value) { return { value: ${type.defaultValue} }; }`
          : ""
      }
      ${
        type.isOptional
          ? `if (!value.value) { return { value: value.value }; }`
          : ""
      }
      
      date = new Date(value.value);
    }

    if (isNaN(date.getTime())) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath, key: "validator.date.invalid", info: {},
          }
        ]
      };
    }

    ${() => {
      if (!isNil(type.validator.min)) {
        const time = new Date(type.validator.min).getTime();

        return js`
          // ${type.validator.min}
          if (date.getTime() < ${time}) {
            const min = "${type.validator.min}";
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.date.dateMin", info: { min },
                }
              ]
            };
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.max)) {
        const time = new Date(type.validator.max).getTime();

        return js`
          // ${type.validator.max}
          if (date.getTime() > ${time}) {
            const max = "${type.validator.max}";
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.date.dateMax", info: { max },
                }
              ]
            };
          }
        `;
      }
    }}

    ${() => {
      if (type.validator.inFuture === true) {
        return js`
          if (date.getTime() < Date.now()) {
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.date.future", info: {},
                }
              ]
            };
          }
        `;
      }
    }}

    ${() => {
      if (type.validator.inPast === true) {
        return js`
          if (date.getTime() > Date.now()) {
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.date.past", info: {},
                }
              ]
            };
          }
        `;
      }
    }}

    return { value: date, };
  `;
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenFileType} type
 * @returns {string}
 */
function anonymousValidatorFile(context, imports, type) {
  if (context.context.options.isBrowser) {
    return js`
      // Blob result from api client
      if (value instanceof Blob) {
        return { value };
      }
      // Blob input as post argument
      if (value && value.blob instanceof Blob) {
        return { value };
      }

      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath, key: "validator.file.unknown", info: {},
          }
        ]
      };
    `;
  }

  return js`
    // ReadableStream input to api call
    if (typeof value.data?.pipe === "function" && typeof value.data?._read ===
      "function") {
      return { value };
    }
    // ReadableStream as output of an api call
    if (typeof value?.pipe === "function" && typeof value?._read === "function") {
      return { value };
    }
    // Object as parsed by the file body parsers
    if (typeof value?.path === "string" && typeof value?.type === "string" &&
      typeof value?.size === "number") {
      ${() => {
        if (!isNil(type.validator?.mimeTypes)) {
          return js`
            if (${type.validator.mimeTypes
              .map((it) => `value.type !== "${it}"`)
              .join(" && ")}) {
              const mimeTypes = [
                " ${type.validator.mimeTypes.join(`", "`)} "
              ];
              /** @type {{ errors: InternalError[] }} */
              return {
                errors: [
                  {
                    propertyPath, key: "validator.file.mimeType", info: { mimeTypes },
                  }
                ]
              };
            }
          `;
        }
      }}

      return { value };
    }

    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath, key: "validator.file.unknown", info: {},
        }
      ]
    };
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
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath, key: "validator.generic.type", info: {},
          }
        ]
      };
    }

    const result = Object.create(null);
    let errors = [];

    for (const key of Object.keys(value)) {
      ${generateAnonymousValidatorCall(
        context,
        imports,
        type.keys,
        "key",
        `propertyPath + ".$key[" + key + "]"`,
        `const genericKey = `,
      )}

      if (genericKey.errors) {
        errors.push(...genericKey.errors);
        continue;
      }

      ${generateAnonymousValidatorCall(
        context,
        imports,
        type.values,
        "value[key]",
        `propertyPath + ".$value[" + key + "]"`,
        `const genericValue =`,
      )}

      if (genericValue.errors) {
        errors.push(...genericValue.errors);
      } else {
        result[genericKey.value] = genericValue.value;
      }
    }

    if (errors.length > 0) {
      return { errors };
    }

    return { value: result };
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
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath, key: "validator.number.type", info: {},
          }
        ]
      };
    }

    ${() => {
      if (!type.validator.floatingPoint) {
        return js`
          if (!Number.isInteger(value)) {
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.number.integer", info: {},
                }
              ]
            };
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.min)) {
        return js`
          if (value < ${type.validator.min}) {
            const min = ${type.validator.min};
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.number.min", info: { min },
                }
              ]
            };
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.max)) {
        return js`
          if (value > ${type.validator.max}) {
            const max = ${type.validator.max};
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.number.max", info: { max },
                }
              ]
            };
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.oneOf)) {
        return js`
          if (${type.oneOf.map((it) => `value !== ${it}`).join(" && ")}) {
            const oneOf = [ ${type.oneOf.join(", ")} ];
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.number.oneOf", info: { oneOf },
                }
              ]
            };
          }
        `;
      }
    }}

    return { value };
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
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath, key: "validator.object.type", info: {},
          }
        ],
      };
    }

    const result = Object.create(null);
    let errors = [];

    ${() => {
      // Setup a keySet, so we can error when extra keys are present
      if (type.validator.strict) {
        return js`
          for (const key of Object.keys(value)) {
            if (!objectKeys${hash}.has(key)) {
              /** @type {{ errors: InternalError[] }} */
              return {
                errors: [
                  {
                    propertyPath, key: "validator.object.strict", info: { extraKey: key },
                  }
                ],
              };
            }
          }
        `;
      }
    }}

    /**
     * @type {[string, (value: *, propertyPath: string) => EitherN<*>][]}
     */
    const validatorPairs = [
      ${() => {
        return Object.keys(type.keys).map((it) => {
          return `["${it}",  ${createOrUseAnonymousFunction(
            context,
            imports,
            type.keys[it],
          )}],`;
        });
      }}
    ];
    
    for (const [key, validator] of validatorPairs) {
      const validatorResult = validator(value[key], \`$\{propertyPath}.$\{key}\`);
      if (validatorResult.errors) {
        errors.push(...validatorResult.errors);
      } else {
        result[key] = validatorResult.value;
      }
    }

    if (errors.length > 0) {
      return { errors };
    }

    return { value: result };
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
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath, key: "validator.string.type", info: {},
          }
        ],
      };
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
      if (type.isOptional && !isNil(type.defaultValue)) {
        return js`
          if (value.length === 0) {
            return { value: ${type.defaultValue} };
          }
        `;
      } else if (type.isOptional) {
        return js`
          if (value.length === 0) {
            return {
              value: ${type.validator?.allowNull ? "null" : "undefined"}
            };
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.min)) {
        return js`
          if (value.length < ${type.validator.min}) {
            const min = ${type.validator.min};
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.string.min", info: { min, },
                }
              ],
            };
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.max)) {
        return js`
          if (value.length > ${type.validator.max}) {
            const max = ${type.validator.max};
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.string.max", info: { max },
                }
              ],
            };
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
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.string.oneOf", info: { oneOf },
                }
              ],
            };
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.pattern)) {
        return js`
          if (!${type.validator.pattern}.test(value)) {
            /** @type {{ errors: InternalError[] }} */
            return {
              errors: [
                {
                  propertyPath, key: "validator.string.pattern", info: {},
                }
              ],
            };
          }
        `;
      }
    }}

    ${() => {
      if (!isNil(type.validator.disallowedCharacters)) {
        return js`
          for (const char of value) {
            if (${type.validator.disallowedCharacters
              .map((it) => `char === "${it}"`)
              .join(" || ")}) {
              const disallowedCharacters = [
                "${type.validator.disallowedCharacters.join('", "')}"
              ];
              /** @type {{ errors: InternalError[] }} */
              return {
                errors: [
                  {
                    propertyPath,
                    key: "validator.string.disallowedCharacter",
                    info: { disallowedCharacters, character: char },
                  }
                ],
              };
            }
          }
        `;
      }
    }}

    return { value };
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
    "return ",
  );
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenType} type
 * @param {string} valueString
 * @param {string} propertyPath
 * @param {string} prefix
 * @returns {string|undefined}
 */
function createInlineValidator(
  context,
  imports,
  type,
  valueString,
  propertyPath,
  prefix,
) {
  if (type.type !== "reference") {
    return undefined;
  }
  // Just don't deal with default values
  if (type.isOptional && !isNil(type.defaultValue)) {
    return undefined;
  }

  // Don't deal with nullable types, and converting values
  if (type.validator?.allowNull || type.validator?.convert) {
    return undefined;
  }

  return inlineValidatorReference(
    context,
    imports,
    type,
    valueString,
    propertyPath,
    prefix,
  );
}

/**
 * @param {ValidatorContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenReferenceType} type
 * @param {string} valueString
 * @param {string} propertyPath
 * @param {string} prefix
 * @returns {string}
 */
function inlineValidatorReference(
  context,
  imports,
  type,
  valueString,
  propertyPath,
  prefix,
) {
  if (!type.isOptional || (type.isOptional && type.reference.isOptional)) {
    return generateAnonymousValidatorCall(
      context,
      imports,
      type.reference,
      valueString,
      propertyPath,
      prefix,
    );
  }
}

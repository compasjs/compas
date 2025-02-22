import { isNil } from "@compas/stdlib";
import { fileBlockEnd, fileBlockStart } from "../file/block.js";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextGetOptional,
  fileContextRemoveLinePrefix,
  fileContextSetIndent,
} from "../file/context.js";
import { fileFormatInlineComment } from "../file/docs.js";
import { fileWrite, fileWriteInline } from "../file/write.js";
import { fileImplementations } from "../processors/file-implementations.js";
import { referenceUtilsGetProperty } from "../processors/reference-utils.js";
import { structureResolveReference } from "../processors/structure.js";
import { JavascriptImportCollector } from "../target/javascript.js";
import { typesCacheGet } from "../types/cache.js";
import { typesGeneratorUseTypeName } from "../types/generator.js";
import { validatorGeneratorGenerateBody } from "./generator.js";

/**
 * Format the input value path for the current value that is being validated.
 *
 * @param {import("./generator.js").ValidatorState} validatorState
 * @returns {string}
 */
function formatValuePath(validatorState) {
  let result = "";

  for (const path of validatorState.validatedValuePath) {
    switch (path.type) {
      case "root":
        result += validatorState.inputVariableName;
        break;
      case "stringKey":
        result += `["${path.key}"]`;
        break;
      case "dynamicKey":
        result += `[${path.key}]`;
        break;
    }
  }

  return result;
}

/**
 * Format the input result path for the current value that is being validated.
 *
 * @param {import("./generator.js").ValidatorState} validatorState
 * @returns {string}
 */
function formatResultPath(validatorState) {
  let result = "";

  for (const path of validatorState.validatedValuePath) {
    if (path.type === "root") {
      result += validatorState.outputVariableName;
    } else if (path.type === "stringKey") {
      result += `["${path.key}"]`;
    } else if (path.type === "dynamicKey") {
      result += `[${path.key}]`;
    }
  }

  return result;
}

/**
 * Format the error key for the current value that is being validated.
 *
 * @param {import("./generator.js").ValidatorState} validatorState
 * @returns {string}
 */
function formatErrorKey(validatorState) {
  let result = `${validatorState.errorMapVariableName}[\``;

  for (const path of validatorState.validatedValuePath) {
    if (path.type === "root") {
      result += `$`;
    } else if (path.type === "stringKey") {
      result += `.${path.key}`;
    } else if (path.type === "dynamicKey") {
      result += `.$\{${path.key}}`;
    }
  }

  result += "`]";

  return result;
}

/**
 * Get or create a Javascript validation file for the group that the type belongs to.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types.d.ts").NamedType<
 *   import("../generated/common/types.d.ts").StructureTypeSystemDefinition
 * >} type
 * @returns {import("../file/context.js").GenerateFile}
 */
export function validatorJavascriptGetFile(generateContext, type) {
  const relativePath = `${type.group}/validators.js`;

  const existingFile = fileContextGetOptional(generateContext, relativePath);

  if (existingFile) {
    return existingFile;
  }

  const file = fileContextCreateGeneric(generateContext, relativePath, {
    importCollector: new JavascriptImportCollector(),
  });

  fileWrite(
    file,
    `/**
 * @template T, E
 * @typedef {{ value: T, error?: never}|{ value?: never, error: E }} Either
 */
 
 /**
  * @typedef {Record<string, any|undefined>} ValidatorErrorMap
  */

  
// eslint-disable-next-line unused-imports/no-unused-vars
const isRecord = (v) => !!v && typeof v === "object" && !Array.isArray(v);
 `,
  );

  return file;
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<
 *   import("../generated/common/types.d.ts").StructureTypeSystemDefinition
 * >} type
 * @param {string} outputTypeName
 * @returns {string}
 */
export function validatorJavascriptGetNameAndImport(
  file,
  type,
  outputTypeName,
) {
  const importCollector = JavascriptImportCollector.getImportCollector(file);

  importCollector.destructure(
    `../${type.group}/validators.js`,
    `validate${outputTypeName}`,
  );

  return `validate${outputTypeName}`;
}

/**
 * Write docs and declare the validator function for the provided type.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<
 *   import("../generated/common/types.d.ts").StructureTypeSystemDefinition
 * >} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptStartValidator(
  generateContext,
  file,
  type,
  validatorState,
) {
  // Write JSDoc block
  fileWrite(file, "/**");
  fileContextAddLinePrefix(file, " *");

  if (type.docString) {
    fileWrite(file, ` ${type.docString}`);
    fileWrite(file, "");
  }

  fileWrite(
    file,
    ` @param {${typesGeneratorUseTypeName(
      generateContext,
      file,
      validatorState.inputTypeName,
    )}|any} ${validatorState.inputVariableName}`,
  );
  fileWrite(
    file,
    ` @returns {Either<${typesGeneratorUseTypeName(
      generateContext,
      file,
      validatorState.outputTypeName,
    )}, ValidatorErrorMap>}`,
  );

  // Finish the JSDoc block
  fileWrite(file, "/");
  fileContextRemoveLinePrefix(file, 2);

  // Initialize the function
  fileBlockStart(
    file,
    `export function validate${validatorState.outputTypeName}(${validatorState.inputVariableName})`,
  );

  // We also initialize the error handling and result variable
  if (validatorState.jsHasInlineTypes) {
    fileWrite(
      file,
      `const ${validatorState.errorMapVariableName}: ValidatorErrorMap = {};`,
    );
    fileWrite(
      file,
      `let ${validatorState.outputVariableName}: any = undefined;\n`,
    );
  } else {
    fileWrite(file, `/** @type {ValidatorErrorMap} */`);
    fileWrite(file, `const ${validatorState.errorMapVariableName} = {};`);
    fileWrite(file, `/** @type {any} */`);
    fileWrite(file, `let ${validatorState.outputVariableName} = undefined;\n`);
  }
}

/**
 * Exit validation function, determines if an error or the value is returned.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptStopValidator(
  generateContext,
  file,
  validatorState,
) {
  fileBlockStart(
    file,
    `if (Object.keys(${validatorState.errorMapVariableName}).length > 0)`,
  );
  fileWrite(file, `return { error: ${validatorState.errorMapVariableName} };`);

  fileBlockEnd(file);

  fileWrite(file, `return { value: ${validatorState.outputVariableName} }`);

  fileBlockEnd(file);
  fileWrite(file, "\n\n");
}

/**
 * Do the nil check, allowNull and defaultValue handling.
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("./generator.js").ValidatorState} validatorState
 * @param {{ isOptional: boolean, allowNull: boolean, defaultValue?: string }} options
 */
export function validatorJavascriptNilCheck(file, validatorState, options) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  fileBlockStart(
    file,
    `if (${valuePath} === null || ${valuePath} === undefined)`,
  );

  if (options.defaultValue) {
    fileWrite(file, `${resultPath} = ${options.defaultValue};`);
  } else if (options.allowNull) {
    fileWrite(file, `${resultPath} = ${valuePath};`);
  } else if (options.isOptional) {
    // Normalizes `null` to `undefined`
    fileWrite(file, `${resultPath} = undefined;`);
  } else {
    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.undefined",
};`,
    );
  }

  fileBlockEnd(file);
  fileBlockStart(file, "else");
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureAnyDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptAny(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  let didWrite = false;
  if (type.targets) {
    for (
      let i = validatorState.outputTypeOptions.targets.length - 1;
      i >= 0;
      --i
    ) {
      const target = type.targets[validatorState.outputTypeOptions.targets[i]];
      if (target?.validatorExpression) {
        fileBlockStart(
          file,
          `if (${target.validatorExpression.replaceAll(`$value$`, valuePath)})`,
        );

        if (target.validatorImport) {
          // Add the necessary imports for the used expression.
          const importCollector =
            JavascriptImportCollector.getImportCollector(file);
          importCollector.raw(target.validatorImport);
        }

        fileWrite(file, `${resultPath} = ${valuePath};`);

        fileBlockEnd(file);
        fileBlockStart(file, `else`);
        fileWrite(
          file,
          `${errorKey} = {
  key: "validator.any",
  message: "Custom validator error. See the input type for more information.",
};`,
        );
        fileBlockEnd(file);

        didWrite = true;
        break;
      }
    }
  }

  if (!didWrite) {
    fileWrite(file, `${resultPath} = ${valuePath};`);
  }
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureAnyOfDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptAnyOf(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  // Fast track validators with discriminant. This also gives much better error objects.
  if (type.validator.discriminant) {
    fileBlockStart(file, `if (!isRecord(${valuePath}))`);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.object",
  value: ${valuePath},
  foundType: typeof ${valuePath},
};`,
    );

    fileBlockEnd(file);
    fileBlockStart(file, "else");

    const matchableValues = [];

    for (const subType of type.values) {
      /** @type {import("../generated/common/types.d.ts").StructureObjectDefinition} */
      // @ts-expect-error
      const resolvedSubType =
        subType.type === "reference" ?
          structureResolveReference(
            validatorState.generateContext.structure,
            subType,
          )
        : subType;

      const oneOf = referenceUtilsGetProperty(
        validatorState.generateContext,
        resolvedSubType.keys[type.validator.discriminant],
        ["oneOf", 0],
      );

      matchableValues.push(oneOf);

      fileBlockStart(
        file,
        `if (typeof value === "object" && "${type.validator.discriminant}" in ${valuePath} && ${valuePath}.${type.validator.discriminant} === "${oneOf}")`,
      );

      validatorState.skipFirstNilCheck = true;
      validatorGeneratorGenerateBody(
        validatorState.generateContext,
        file,

        // @ts-ignore-error
        //
        // Ref is always a system type here
        subType,
        validatorState,
      );

      fileBlockEnd(file);
      fileWriteInline(file, `else `);
    }

    fileBlockStart(file, ``);
    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.anyOf",
  discriminant: "${type.validator.discriminant}",
  foundValue: ${valuePath}.${type.validator.discriminant},
  allowedValues: ${JSON.stringify(matchableValues)},
};`,
    );
    fileBlockEnd(file);

    // isRecord end
    fileBlockEnd(file);

    return;
  }

  const anyOfMatchVariable = `hasAnyOfMatch${validatorState.reusedVariableIndex++}`;

  fileWrite(file, `let ${anyOfMatchVariable} = false;`);
  fileWrite(
    file,
    `${errorKey} = {
  key: "validator.anyOf",
  errors: [],
};`,
  );

  for (const subType of type.values) {
    fileBlockStart(file, `if (!${anyOfMatchVariable})`);

    validatorState.reusedVariableIndex++;

    if (validatorState.jsHasInlineTypes) {
      fileWrite(
        file,
        `const intermediateErrorMap${validatorState.reusedVariableIndex}: ValidatorErrorMap = {};`,
      );
      fileWrite(
        file,
        `let intermediateResult${validatorState.reusedVariableIndex}: any = undefined;`,
      );
      fileWrite(
        file,
        `let intermediateValue${validatorState.reusedVariableIndex}: any = ${valuePath};\n`,
      );
    } else {
      fileWrite(file, `/** @type {ValidatorErrorMap} */`);
      fileWrite(
        file,
        `const intermediateErrorMap${validatorState.reusedVariableIndex} = {};`,
      );
      fileWrite(file, `/** @type {any} */`);
      fileWrite(
        file,
        `let intermediateResult${validatorState.reusedVariableIndex} = undefined;`,
      );
      fileWrite(file, `/** @type {any} */`);
      fileWrite(
        file,
        `let intermediateValue${validatorState.reusedVariableIndex} = ${valuePath};\n`,
      );
    }

    /** @type {import("./generator.js").ValidatorState} */
    const validatorStateCopy = {
      ...validatorState,

      validatedValuePath: [{ type: "root" }],
      inputVariableName: `intermediateValue${validatorState.reusedVariableIndex}`,
      outputVariableName: `intermediateResult${validatorState.reusedVariableIndex}`,
      errorMapVariableName: `intermediateErrorMap${validatorState.reusedVariableIndex}`,
    };

    const nestedResultPath = formatResultPath(validatorStateCopy);

    validatorGeneratorGenerateBody(
      validatorState.generateContext,
      file,

      // @ts-ignore-error
      //
      // Ref is always a system type here
      subType,
      validatorStateCopy,
    );

    fileBlockStart(
      file,
      `if (Object.keys(${validatorStateCopy.errorMapVariableName}).length > 0)`,
    );

    fileWrite(
      file,
      `${errorKey}.errors.push(${validatorStateCopy.errorMapVariableName});`,
    );

    fileBlockEnd(file);
    fileBlockStart(file, "else");

    fileWrite(file, `${anyOfMatchVariable} = true;`);
    fileWrite(file, `delete ${errorKey};`);
    fileWrite(file, `${resultPath} = ${nestedResultPath};`);

    fileBlockEnd(file);
    fileBlockEnd(file);

    validatorState.reusedVariableIndex--;
  }

  validatorState.reusedVariableIndex--;
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureArrayDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptArray(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  validatorState.reusedVariableIndex++;

  if (validatorState.jsHasInlineTypes) {
    fileWrite(
      file,
      `const intermediateErrorMap${validatorState.reusedVariableIndex}: ValidatorErrorMap = {};`,
    );
    fileWrite(
      file,
      `let intermediateResult${validatorState.reusedVariableIndex}: any[] = [];`,
    );
    fileWrite(
      file,
      `let intermediateValue${validatorState.reusedVariableIndex}: any|any[] = ${valuePath};\n`,
    );
  } else {
    fileWrite(file, `/** @type {ValidatorErrorMap} */`);
    fileWrite(
      file,
      `const intermediateErrorMap${validatorState.reusedVariableIndex} = {};`,
    );
    fileWrite(file, `/** @type {any[]} */`);
    fileWrite(
      file,
      `let intermediateResult${validatorState.reusedVariableIndex} = [];`,
    );
    fileWrite(file, `/** @type {any|any[]} */`);
    fileWrite(
      file,
      `${type.validator.convert ? "let" : "const"} intermediateValue${validatorState.reusedVariableIndex} = ${valuePath};\n`,
    );
  }

  /** @type {import("./generator.js").ValidatorState} */
  const validatorStateCopy = {
    ...validatorState,

    validatedValuePath: [{ type: "root" }],
    inputVariableName: `intermediateValue${validatorState.reusedVariableIndex}`,
    outputVariableName: `intermediateResult${validatorState.reusedVariableIndex}`,
    errorMapVariableName: `intermediateErrorMap${validatorState.reusedVariableIndex}`,
  };

  const currentValuePath = formatValuePath(validatorStateCopy);
  const currentResultPath = formatResultPath(validatorStateCopy);

  if (type.validator.convert) {
    fileBlockStart(file, `if (!Array.isArray(${currentValuePath}))`);
    fileWrite(file, `${currentValuePath} = [${currentValuePath}];`);
    fileBlockEnd(file);
  }

  if (!type.validator.convert) {
    fileBlockStart(file, `if (!Array.isArray(${currentValuePath}))`);
    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.array",
  value: ${currentValuePath},
};`,
    );
    fileBlockEnd(file);
    fileBlockStart(file, `else`);
  }

  if (!isNil(type.validator.min)) {
    fileBlockStart(
      file,
      `if (${currentValuePath}.length < ${type.validator.min})`,
    );

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.length",
  minLength: ${type.validator.min},
  foundLength: ${currentValuePath}.length,
};`,
    );

    fileBlockEnd(file);
  }

  if (!isNil(type.validator.max)) {
    fileBlockStart(
      file,
      `if (${currentValuePath}.length > ${type.validator.max})`,
    );

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.length",
  maxLength: ${type.validator.max},
  foundLength: ${currentValuePath}.length,
};`,
    );

    fileBlockEnd(file);
  }

  // Initialize result array
  fileWrite(file, `${resultPath} = [];`);

  // Loop through array
  const idxVariable = `i${validatorState.reusedVariableIndex++}`;
  validatorStateCopy.validatedValuePath.push({
    type: "dynamicKey",
    key: idxVariable,
  });

  fileBlockStart(
    file,
    `for (let ${idxVariable} = 0; ${idxVariable} < ${currentValuePath}.length; ++${idxVariable})`,
  );

  validatorGeneratorGenerateBody(
    validatorState.generateContext,
    file,

    // @ts-ignore-error
    //
    // Ref is always a system type here
    type.values,
    validatorStateCopy,
  );

  fileBlockEnd(file);

  if (!type.validator.convert) {
    fileBlockEnd(file);
  }

  fileBlockStart(
    file,
    `if (Object.keys(${validatorStateCopy.errorMapVariableName}).length)`,
  );

  fileBlockStart(
    file,
    `for (const errorKey of Object.keys(${validatorStateCopy.errorMapVariableName}))`,
  );

  fileWrite(
    file,
    `${errorKey.substring(0, errorKey.length - 2)}$\{errorKey.substring(1)}\`] = ${
      validatorStateCopy.errorMapVariableName
    }[errorKey];`,
  );

  fileBlockEnd(file);
  fileBlockEnd(file);

  fileBlockStart(file, "else");
  fileWrite(file, `${resultPath} = ${currentResultPath};`);
  fileBlockEnd(file);

  // Reset state;
  validatorState.reusedVariableIndex--;
  validatorState.reusedVariableIndex--;
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureBooleanDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptBoolean(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  if (!isNil(type.oneOf)) {
    fileBlockStart(
      file,
      `if (${valuePath} === ${type.oneOf} || ${valuePath} === "${
        type.oneOf
      }" || ${valuePath} === ${type.oneOf ? 1 : 0} || ${valuePath} === "${
        type.oneOf ? 1 : 0
      }")`,
    );

    fileWrite(file, `${resultPath} = ${type.oneOf};`);

    fileBlockEnd(file);
    fileBlockStart(file, `else`);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.oneOf",
  allowedValues: [${type.oneOf}],
  foundValue: ${valuePath},
};`,
    );

    fileBlockEnd(file);
  } else {
    fileBlockStart(
      file,
      `if (${valuePath} === true || ${valuePath} === "true" || ${valuePath} === 1 || ${valuePath} === "1")`,
    );
    fileWrite(file, `${resultPath} = true;`);

    fileBlockEnd(file);
    fileBlockStart(
      file,
      `else if (${valuePath} === false || ${valuePath} === "false" || ${valuePath} === 0 || ${valuePath} === "0")`,
    );
    fileWrite(file, `${resultPath} = false;`);

    fileBlockEnd(file);
    fileBlockStart(file, "else");

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.type",
  expectedType: "boolean",
};`,
    );

    fileBlockEnd(file);
  }
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureDateDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptDate(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  if (type.specifier === "dateOnly") {
    fileWrite(file, fileFormatInlineComment(file, `yyyy-MM-dd`));
    fileBlockStart(
      file,
      `if (typeof ${valuePath} !== "string" || !(/^\\d{4}-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2][0-9])|(3[0-1]))$/gi).test(${valuePath}))`,
    );

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.pattern",
  patternExplanation: "yyyy-MM-dd",
};`,
    );

    fileBlockEnd(file);
    fileBlockStart(file, "else");

    fileWrite(file, `${resultPath} = ${valuePath};`);

    fileBlockEnd(file);
  } else if (type.specifier === "timeOnly") {
    fileWrite(file, fileFormatInlineComment(file, `HH:mm(:ss(.SSS)`));
    fileBlockStart(
      file,
      `if (typeof ${valuePath} !== "string" || !(/^(([0-1][0-9])|(2[0-3])):[0-5][0-9](:[0-5][0-9](\\.\\d{3})?)?$/gi).test(${valuePath}))`,
    );

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.pattern",
  patternExplanation: "HH:mm(:ss(.SSS))",
};`,
    );

    fileBlockEnd(file);
    fileBlockStart(file, "else");

    fileWrite(file, `${resultPath} = ${valuePath};`);

    fileBlockEnd(file);
  } else {
    fileBlockStart(
      file,
      `if (typeof ${valuePath} === "string" || typeof ${valuePath} === "number")`,
    );

    fileWrite(file, `${resultPath} = new Date(${valuePath});`);

    fileBlockEnd(file);
    fileBlockStart(
      file,
      `else if (Object.prototype.toString.call(${valuePath}) === "[object Date]")`,
    );

    fileWrite(file, `${resultPath} = ${valuePath};`);

    fileBlockEnd(file);
    fileBlockStart(file, "else");

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.type",
  expectedType: "Date|string",
};`,
    );

    fileBlockEnd(file);

    // Note that `null` and `undefined` behave differently when passed to `isNaN`.
    fileBlockStart(file, `if (isNaN(${resultPath}?.getTime() ?? undefined))`);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.date.invalid",
};`,
    );

    fileBlockEnd(file);

    if (
      !isNil(type.validator.min) ||
      !isNil(type.validator.max) ||
      type.validator.inFuture ||
      type.validator.inPast
    ) {
      fileBlockStart(file, "else");
    }

    if (!isNil(type.validator.min)) {
      fileBlockStart(
        file,
        `if (${valuePath} < new Date("${type.validator.min}"))`,
      );

      fileWrite(
        file,
        `${errorKey} = {
  key: "validator.range",
  minValue: new Date("${type.validator.min}"),
};`,
      );

      fileBlockEnd(file);
    }

    if (!isNil(type.validator.max)) {
      fileBlockStart(
        file,
        `if (${valuePath} > new Date("${type.validator.max}"))`,
      );

      fileWrite(
        file,
        `${errorKey} = {
  key: "validator.range",
  maxValue: new Date("${type.validator.max}")
};`,
      );

      fileBlockEnd(file);
    }

    if (type.validator.inFuture) {
      fileBlockStart(file, `if (${valuePath} < new Date())`);

      fileWrite(
        file,
        `${errorKey} = {
  key: "validator.range",
  minValue: new Date(),
};`,
      );

      fileBlockEnd(file);
    }

    if (type.validator.inPast) {
      fileBlockStart(file, `if (${valuePath} > new Date())`);

      fileWrite(
        file,
        `${errorKey} = {
  key: "validator.range",
  maxValue: new Date(),
};`,
      );

      fileBlockEnd(file);
    }

    if (
      !isNil(type.validator.min) ||
      !isNil(type.validator.max) ||
      type.validator.inFuture ||
      type.validator.inPast
    ) {
      fileBlockEnd(file);
    }
  }
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureFileDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptFile(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  let didWrite = false;
  for (
    let i = validatorState.outputTypeOptions.targets.length - 1;
    i >= 0;
    --i
  ) {
    const target =
      fileImplementations[validatorState.outputTypeOptions.targets[i]];
    if (target?.validatorExpression) {
      fileBlockStart(
        file,
        `if (${target.validatorExpression.replaceAll(`$value$`, valuePath)})`,
      );

      if (target.validatorImport) {
        // Add the necessary imports for the used expression.
        const importCollector =
          JavascriptImportCollector.getImportCollector(file);
        importCollector.raw(target.validatorImport);
      }

      fileWrite(file, `${resultPath} = ${valuePath};`);

      fileBlockEnd(file);
      fileBlockStart(file, `else`);
      fileWrite(
        file,
        `${errorKey} = {
  key: "validator.file",
  message: "Invalid file input. See the input type for more information.",
};`,
      );
      fileBlockEnd(file);

      didWrite = true;
      break;
    }
  }

  if (!didWrite) {
    fileWrite(file, `${resultPath} = ${valuePath};`);
  } else if (
    validatorState.outputTypeOptions.targets.includes("jsKoaReceive")
  ) {
    if (!isNil(type.validator.mimeTypes)) {
      fileBlockStart(file, `if (${resultPath}?.mimetype)`);

      fileBlockStart(
        file,
        `if (!${JSON.stringify(
          type.validator.mimeTypes,
        )}.includes(${resultPath}?.mimetype))`,
      );

      fileWrite(
        file,
        `${errorKey} = {
  key: "validator.mimeType",
  foundMimeType: ${resultPath}.mimetype,
  allowedMimeTypes: ${JSON.stringify(type.validator.mimeTypes)},
};`,
      );

      fileBlockEnd(file);
      fileBlockEnd(file);
    }
  }
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureGenericDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptGeneric(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  fileBlockStart(file, `if (!isRecord(${valuePath}))`);
  fileWrite(
    file,
    `${errorKey} = {
  key: "validator.generic",
};`,
  );
  fileBlockEnd(file);
  fileBlockStart(file, `else`);

  const keyVariable = `genericKeyInput${validatorState.reusedVariableIndex++}`;
  const resultVariable = `genericKeyResult${validatorState.reusedVariableIndex++}`;
  const errorMapVariable = `genericKeyErrorMap${validatorState.reusedVariableIndex++}`;

  /** @type {import("./generator.js").ValidatorState} */
  const nestedKeyState = {
    ...validatorState,
    inputVariableName: keyVariable,
    outputVariableName: resultVariable,
    errorMapVariableName: errorMapVariable,
    validatedValuePath: [{ type: "root" }],
  };

  // Already set the nested validator path for generic values
  validatorState.validatedValuePath.push({
    type: "dynamicKey",
    key: resultVariable,
  });

  fileWrite(file, `${resultPath} = {};`);

  fileBlockStart(file, `for (let ${keyVariable} of Object.keys(${valuePath}))`);

  if (validatorState.jsHasInlineTypes) {
    fileWrite(file, `let ${resultVariable}: string = "";`);
    fileWrite(file, `const ${errorMapVariable}: ValidatorErrorMap = {};`);
  } else {
    fileWrite(file, `/** @type {any} */`);
    fileWrite(file, `let ${resultVariable} = undefined;`);
    fileWrite(file, `/** @type {ValidatorErrorMap} */`);
    fileWrite(file, `const ${errorMapVariable} = {};`);
  }

  validatorGeneratorGenerateBody(
    validatorState.generateContext,
    file,

    // @ts-expect-error
    type.keys,
    nestedKeyState,
  );

  fileBlockStart(file, `if (Object.keys(${errorMapVariable}).length !== 0)`);

  fileBlockStart(file, `if (${errorKey})`);

  fileWrite(
    file,
    `${errorKey}.inputs.push({ key: ${keyVariable}, errors: ${errorMapVariable} });`,
  );

  fileBlockEnd(file);
  fileBlockStart(file, "else");

  fileWrite(
    file,
    `${errorKey} = {
  key: "validator.generic",
  inputs: [{ key: ${keyVariable}, errors: ${errorMapVariable} }],
};`,
  );

  fileBlockEnd(file);

  fileBlockEnd(file);
  fileBlockStart(file, "else");

  validatorGeneratorGenerateBody(
    validatorState.generateContext,
    file,

    // @ts-expect-error
    type.values,
    validatorState,
  );

  fileBlockEnd(file);

  fileBlockEnd(file);

  fileBlockEnd(file);

  validatorState.validatedValuePath.pop();

  validatorState.reusedVariableIndex--;
  validatorState.reusedVariableIndex--;
  validatorState.reusedVariableIndex--;
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureNumberDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptNumber(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  const intermediateVariable = `convertedNumber${validatorState.reusedVariableIndex++}`;

  fileWrite(file, `let ${intermediateVariable} = ${valuePath};`);

  fileBlockStart(
    file,
    `if (typeof ${intermediateVariable} !== "number" && typeof ${intermediateVariable} === "string")`,
  );

  fileWrite(file, `${intermediateVariable} = Number(${intermediateVariable});`);

  fileBlockEnd(file);

  const conditionPartial =
    !type.validator.floatingPoint ?
      `|| !Number.isInteger(${intermediateVariable})`
    : "";
  const subType = type.validator.floatingPoint ? "float" : "int";

  fileBlockStart(
    file,
    `if (typeof ${intermediateVariable} !== "number" || isNaN(${intermediateVariable}) || !isFinite(${intermediateVariable}) ${conditionPartial})`,
  );

  fileWrite(
    file,
    `${errorKey} = {
  key: "validator.number",
  subType: "${subType}",
};`,
  );

  fileContextSetIndent(file, -1);
  fileWriteInline(file, "} else ");

  if (!isNil(type.validator.min)) {
    fileWrite(file, `if (${intermediateVariable} < ${type.validator.min}) {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.range",
  minValue: ${type.validator.min},
};`,
    );

    fileContextSetIndent(file, -1);
    fileWriteInline(file, `} else `);
  }

  if (!isNil(type.validator.max)) {
    fileWrite(file, `if (${intermediateVariable} > ${type.validator.max}) {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.range",
  maxValue: ${type.validator.max}
};`,
    );

    fileContextSetIndent(file, -1);
    fileWriteInline(file, `} else `);
  }

  if (type.oneOf) {
    const condition = type.oneOf
      .map((it) => `${intermediateVariable} !== ${it}`)
      .join(" && ");

    fileWrite(file, `if (${condition}) {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.oneOf",
  allowedValues: [${type.oneOf.join(", ")}],
  foundValue: ${intermediateVariable},
};`,
    );

    fileContextSetIndent(file, -1);
    fileWriteInline(file, `} else `);
  }

  fileBlockStart(file, ``);
  fileWrite(file, `${resultPath} = ${intermediateVariable};`);

  fileBlockEnd(file);

  validatorState.reusedVariableIndex--;
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureObjectDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptObject(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  fileBlockStart(file, `if (!isRecord(${valuePath}))`);

  fileWrite(
    file,
    `${errorKey} = {
  key: "validator.object",
  value: ${valuePath},
  foundType: typeof ${valuePath},
};`,
  );

  fileBlockEnd(file);
  fileBlockStart(file, "else");

  const isApiClientValidator =
    validatorState.outputTypeOptions.targets.includes("jsAxios") ||
    validatorState.outputTypeOptions.targets.includes("tsAxios");

  // Allows api clients to skip strict validation, even if the type enforces it to prevent
  // unnecessary breaking changes when new keys are added to the response.
  if (
    type.validator.strict &&
    (!isApiClientValidator ||
      validatorState.generateContext.options.generators.apiClient
        ?.responseValidation.looseObjectValidation === false)
  ) {
    const setVariable = `knownKeys${validatorState.reusedVariableIndex++}`;

    if (validatorState.jsHasInlineTypes) {
      fileWrite(file, `const ${setVariable}: Set<string> = new Set([`);
    } else {
      fileWrite(file, `/** @type {Set<string>} */`);
      fileWrite(file, `const ${setVariable} = new Set([`);
    }

    fileContextSetIndent(file, 1);
    for (const key of Object.keys(type.keys)) {
      fileWrite(file, `"${key}",`);
    }
    fileContextSetIndent(file, -1);
    fileWrite(file, `]);`);

    fileBlockStart(file, `for (const key of Object.keys(${valuePath}))`);
    fileBlockStart(
      file,
      `if (!${setVariable}.has(key) && ${valuePath}[key] !== null && ${valuePath}[key] !== undefined)`,
    );
    fileWrite(file, `const expectedKeys = [...${setVariable}];`);
    fileWrite(file, `const foundKeys = Object.keys(${valuePath});`);
    fileWrite(
      file,
      `const unknownKeys  = foundKeys.filter(it => !${setVariable}.has(it));`,
    );

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.keys",
  unknownKeys,
  expectedKeys,
  foundKeys,
};`,
    );
    fileWrite(file, `break;`);

    fileBlockEnd(file);
    fileBlockEnd(file);

    validatorState.reusedVariableIndex--;
  }

  fileWrite(
    file,
    `${resultPath} = { ${Object.keys(type.keys)
      .map((it) => `"${it}": undefined,`)
      .join(" ")}};\n`,
  );

  let variableIndex = 0;

  for (const key of Object.keys(type.keys)) {
    validatorState.validatedValuePath.push({ type: "stringKey", key });

    variableIndex++;
    validatorState.reusedVariableIndex++;

    validatorGeneratorGenerateBody(
      validatorState.generateContext,
      file,

      // @ts-ignore-error
      //
      // Ref is always a system type here
      type.keys[key],
      validatorState,
    );

    validatorState.validatedValuePath.pop();
  }

  validatorState.reusedVariableIndex -= variableIndex;

  fileBlockEnd(file);
}

/**
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureReferenceDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptReference(
  generateContext,
  file,
  type,
  validatorState,
) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  const ref = structureResolveReference(
    validatorState.generateContext.structure,
    type,
  );

  const referredTypeName = typesCacheGet(
    generateContext,

    // @ts-ignore-error
    //
    // Ref is always a system type here
    ref,
    validatorState.outputTypeOptions,
  );

  if (generateContext.options.targetLanguage === "js") {
    if (file.relativePath !== `${type.reference.group}/validators.js`) {
      const importCollector =
        JavascriptImportCollector.getImportCollector(file);
      importCollector.destructure(
        `../${type.reference.group}/validators.js`,
        `validate${referredTypeName}`,
      );
    }
  } else if (generateContext.options.targetLanguage === "ts") {
    if (file.relativePath !== `${type.reference.group}/validators.ts`) {
      const importCollector =
        JavascriptImportCollector.getImportCollector(file);
      importCollector.destructure(
        `../${type.reference.group}/validators.js`,
        `validate${referredTypeName}`,
      );
    }
  }

  const intermediateVariable = `refResult${validatorState.reusedVariableIndex++}`;

  fileWrite(
    file,
    `const ${intermediateVariable} = validate${referredTypeName}(${valuePath});\n`,
  );

  fileBlockStart(file, `if (${intermediateVariable}.error)`);

  fileBlockStart(
    file,
    `for (const errorKey of Object.keys(${intermediateVariable}.error))`,
  );

  fileWrite(
    file,
    `${errorKey.substring(
      0,
      errorKey.length - 2,
    )}$\{errorKey.substring(1)}\`] = ${intermediateVariable}.error[errorKey];`,
  );

  fileBlockEnd(file);
  fileBlockEnd(file);

  fileWrite(file, `${resultPath} = ${intermediateVariable}.value;`);

  validatorState.reusedVariableIndex--;
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureStringDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptString(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  const intermediateVariable = `convertedString${validatorState.reusedVariableIndex++}`;

  if (validatorState.jsHasInlineTypes) {
    fileWrite(
      file,
      `let ${intermediateVariable}: string = ${valuePath} as any;`,
    );
  } else {
    fileWrite(file, `/** @type {string} */`);

    fileWrite(file, `let ${intermediateVariable} = ${valuePath};`);
  }

  fileBlockStart(file, `if (typeof ${intermediateVariable} !== "string")`);

  fileWrite(
    file,
    `${errorKey} = {
  key: "validator.string",
};`,
  );

  fileBlockEnd(file);
  fileBlockStart(file, `else`);

  if (type.validator.trim) {
    fileWrite(
      file,
      `${intermediateVariable} = ${intermediateVariable}.trim();`,
    );
  }

  if (type.isOptional) {
    fileBlockStart(file, `if (${intermediateVariable}.length === 0)`);

    if (type.validator.min === 0) {
      // This is a valid input, so it gets priority over the defaultValue.
      fileWrite(file, `${resultPath} = "";`);
    } else if (!isNil(type.defaultValue)) {
      fileWrite(file, `${resultPath} = ${type.defaultValue};`);
    } else {
      fileWrite(
        file,
        `${resultPath} = ${type.validator.allowNull ? "null" : "undefined"};`,
      );
    }

    fileBlockEnd(file);
    fileBlockStart(file, "else");
  }

  if (type.validator.upperCase) {
    fileWrite(
      file,
      `${intermediateVariable} = ${intermediateVariable}.toUpperCase();`,
    );
  }
  if (type.validator.lowerCase) {
    fileWrite(
      file,
      `${intermediateVariable} = ${intermediateVariable}.toLowerCase();`,
    );
  }

  if (!isNil(type.validator.min) && type.validator.min > 0) {
    fileBlockStart(
      file,
      `if (${intermediateVariable}.length < ${type.validator.min})`,
    );

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.length",
  minLength: ${type.validator.min}
};`,
    );

    fileContextSetIndent(file, -1);
    fileWriteInline(file, `} else `);
  }

  if (!isNil(type.validator.max)) {
    fileWrite(
      file,
      `if (${intermediateVariable}.length > ${type.validator.max}) {`,
    );
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.length",
  maxLength: ${type.validator.max}
};`,
    );

    fileContextSetIndent(file, -1);
    fileWriteInline(file, `} else `);
  }

  if (type.oneOf) {
    const condition = type.oneOf
      .map((it) => `${intermediateVariable} !== "${it}"`)
      .join(" && ");

    fileWrite(file, `if (${condition}) {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.oneOf",
  allowedValues: ${JSON.stringify(type.oneOf)},
  foundValue: ${intermediateVariable},
};`,
    );

    fileContextSetIndent(file, -1);
    fileWriteInline(file, `} else `);
  }

  if (type.validator.pattern) {
    fileWrite(
      file,
      `if (!${type.validator.pattern}.test(${intermediateVariable})) {`,
    );
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.pattern",
};`,
    );

    fileContextSetIndent(file, -1);
    fileWriteInline(file, `} else `);
  }

  if (type.validator.disallowedCharacters) {
    const conditional = type.validator.disallowedCharacters
      .map((it) => `${intermediateVariable}.includes(${JSON.stringify(it)})`)
      .join(" || ");
    fileWrite(file, `if (${conditional}) {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.disallowedCharacters",
  disallowedCharacters: ${JSON.stringify(type.validator.disallowedCharacters)},
};`,
    );

    fileContextSetIndent(file, -1);
    fileWriteInline(file, `} else `);
  }

  fileBlockStart(file, ``);
  fileWrite(file, `${resultPath} = ${intermediateVariable};`);

  fileBlockEnd(file);

  if (type.isOptional) {
    fileBlockEnd(file);
  }

  fileBlockEnd(file);

  validatorState.reusedVariableIndex--;
}

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../generated/common/types.js").StructureUuidDefinition} type
 * @param {import("./generator.js").ValidatorState} validatorState
 */
export function validatorJavascriptUuid(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  const regex =
    "/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/gi";
  const regexWithoutDash = "/^[a-f0-9]{32}$/gi";

  fileBlockStart(
    file,
    `if (typeof ${valuePath} !== "string" || (!${regex}.test(${valuePath}) && !${regexWithoutDash}.test(${valuePath})))`,
  );

  fileWrite(
    file,
    `${errorKey} = {
  key: "validator.pattern",
  patternExplanation: "UUID",
};`,
  );

  fileBlockEnd(file);
  fileBlockStart(file, `else if (${valuePath}.length === 32)`);
  fileWrite(
    file,
    `${resultPath} = ${valuePath}.slice(0,8) + "-" + ${valuePath}.slice(8, 12) + "-" + ${valuePath}.slice(12, 16) + "-" + ${valuePath}.slice(16, 20) + "-" + ${valuePath}.slice(20);`,
  );
  fileBlockEnd(file);
  fileBlockStart(file, `else`);
  fileWrite(file, `${resultPath} = ${valuePath};`);

  fileBlockEnd(file);
}

/**
 * Finish the else block for nil checks.
 *
 * @param {import("../file/context.js").GenerateFile} file
 */
export function validatorJavascriptFinishElseBlock(file) {
  fileBlockEnd(file);
}

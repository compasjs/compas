import { isNil } from "@compas/stdlib";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextGetOptional,
  fileContextRemoveLinePrefix,
  fileContextSetIndent,
} from "../file/context.js";
import { fileFormatInlineComment } from "../file/format.js";
import { fileWrite, fileWriteInline } from "../file/write.js";
import { structureResolveReference } from "../processors/structure.js";
import { JavascriptImportCollector } from "../target/javascript.js";
import { typesCacheGet } from "../types/cache.js";
import { typesGeneratorUseTypeName } from "../types/generator.js";
import { validatorGeneratorGenerateBody } from "./generator.js";

/**
 * Format the input value path for the current value that is being validated.
 *
 * @param {import("./generator").ValidatorState} validatorState
 * @returns {string}
 */
function formatValuePath(validatorState) {
  let result = "";

  for (const path of validatorState.validatedValuePath) {
    if (path.type === "root") {
      result += validatorState.inputVariableName;
    } else if (path.type === "stringKey") {
      result += `["${path.key}"]`;
    } else if (path.type === "dynamicKey") {
      result += `[${path.key}]`;
    }
  }

  return result;
}

/**
 * Format the input result path for the current value that is being validated.
 *
 * @param {import("./generator").ValidatorState} validatorState
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
 * @param {import("./generator").ValidatorState} validatorState
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
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @returns {import("../file/context").GenerateFile}
 */
export function validatorJavascriptGetFile(generateContext, type) {
  const relativePath = `${type.group}/validators.js`;

  const existingFile = fileContextGetOptional(generateContext, relativePath);

  if (existingFile) {
    return existingFile;
  }

  return fileContextCreateGeneric(generateContext, relativePath, {
    importCollector: new JavascriptImportCollector(),
  });
}

/**
 * Check if the provided file already contains a generator for the provided output name.
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {string} outputTypeName
 * @returns {boolean}
 */
export function validatorJavascriptHasValidatorForOutputTypeName(
  file,
  outputTypeName,
) {
  return file.contents.includes(` function validate${outputTypeName}`);
}

/**
 * Write docs, and declare the validator function for the provided type.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {import("../validators/generator").ValidatorState} validatorState
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
    fileWrite(file, type.docString);
    fileWrite(file, "");
  }

  fileWrite(
    file,
    ` @param {${typesGeneratorUseTypeName(
      generateContext,
      file,
      validatorState.inputTypeName,
    )}|unknown} ${validatorState.inputVariableName}`,
  );
  fileWrite(
    file,
    ` @returns {import("@compas/stdlib").Either<${typesGeneratorUseTypeName(
      generateContext,
      file,
      validatorState.outputTypeName,
    )}, import("@compas/stdlib").AppError>}`,
  );

  // Finish the JSDoc block
  fileWrite(file, "/");
  fileContextRemoveLinePrefix(file, 2);

  // Initialize the function
  fileWrite(
    file,
    `export function validate${validatorState.outputTypeName}(${validatorState.inputVariableName}) {`,
  );
  fileContextSetIndent(file, 1);

  // We also initialize the error handling and result variable
  fileWrite(file, `const ${validatorState.errorMapVariableName} = {};`);
  fileWrite(file, `let ${validatorState.outputVariableName} = undefined;\n`);
}

/**
 * Exit validation function, determines if an error or the value is returned.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptStopValidator(
  generateContext,
  file,
  validatorState,
) {
  fileWrite(
    file,
    `if (Object.keys(${validatorState.errorMapVariableName}).length > 0) {`,
  );
  fileContextSetIndent(file, 1);
  fileWrite(file, `return { error: ${validatorState.errorMapVariableName} };`);
  fileContextSetIndent(file, -1);
  fileWrite(file, "}\n");

  fileWrite(file, `return { value: ${validatorState.outputVariableName} }`);

  fileContextSetIndent(file, -1);
  fileWrite(file, "}\n\n");
}

/**
 * Do the nil check, allowNull and defaultValue handling.
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("./generator").ValidatorState} validatorState
 * @param {{ isOptional: boolean, allowNull: boolean, defaultValue?: string }} options
 */
export function validatorJavascriptNilCheck(file, validatorState, options) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  fileWrite(file, `if (${valuePath} === null || ${valuePath} === undefined) {`);
  fileContextSetIndent(file, 1);

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

  fileContextSetIndent(file, -1);
  fileWrite(file, `} else {`);
  fileContextSetIndent(file, 1);
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalAnyDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptAny(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);

  // const errorKey = formatErrorKey(validatorState);
  // TODO: implement custom validators for custom raw types.

  fileWrite(file, `${resultPath} = ${valuePath};`);
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalAnyOfDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptAnyOf(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

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
    fileWrite(file, `if (!${anyOfMatchVariable}) {`);
    fileContextSetIndent(file, 1);

    validatorState.reusedVariableIndex++;

    fileWrite(
      file,
      `const intermediateErrorMap${validatorState.reusedVariableIndex} = {};`,
    );
    fileWrite(
      file,
      `let intermediateResult${validatorState.reusedVariableIndex} = undefined;`,
    );
    fileWrite(
      file,
      `let intermediateValue${validatorState.reusedVariableIndex} = ${valuePath};\n`,
    );

    /** @type {import("./generator").ValidatorState} */
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

    fileWrite(
      file,
      `if (Object.keys(${validatorStateCopy.errorMapVariableName}).length > 0) {`,
    );
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey}.errors.push(${validatorStateCopy.errorMapVariableName});`,
    );

    fileContextSetIndent(file, -1);
    fileWrite(file, `} else {`);
    fileContextSetIndent(file, 1);

    fileWrite(file, `${anyOfMatchVariable} = true;`);
    fileWrite(file, `delete ${errorKey};`);
    fileWrite(file, `${resultPath} = ${nestedResultPath};`);

    fileContextSetIndent(file, -1);
    fileWrite(file, `}`);

    fileContextSetIndent(file, -1);
    fileWrite(file, `}`);

    validatorState.reusedVariableIndex--;
  }

  validatorState.reusedVariableIndex--;
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalArrayDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptArray(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  fileWrite(file, `if (!Array.isArray(${valuePath})) {`);
  fileContextSetIndent(file, 1);
  fileWrite(file, `${valuePath} = [${valuePath}];`);
  fileContextSetIndent(file, -1);
  fileWrite(file, `}\n`);

  if (!isNil(type.validator.min)) {
    fileWrite(file, `if (${valuePath}.length < ${type.validator.min}) {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.length",
  minLength: ${type.validator.min}
};`,
    );

    fileContextSetIndent(file, -1);
    fileWrite(file, `}\n`);
  }

  if (!isNil(type.validator.max)) {
    fileWrite(file, `if (${valuePath}.length > ${type.validator.max}) {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.length",
  maxLength: ${type.validator.max}
};`,
    );

    fileContextSetIndent(file, -1);
    fileWrite(file, `}\n`);
  }

  // Initialize result array
  fileWrite(
    file,
    `${resultPath} = Array.from({ length: ${valuePath}.length });`,
  );

  // Loop through array
  const idxVariable = `i${validatorState.reusedVariableIndex++}`;
  validatorState.validatedValuePath.push({
    type: "dynamicKey",
    key: idxVariable,
  });

  fileWrite(
    file,
    `for (let ${idxVariable} = 0; ${idxVariable} < ${valuePath}.length; ++${idxVariable}) {`,
  );
  fileContextSetIndent(file, 1);

  validatorGeneratorGenerateBody(
    validatorState.generateContext,
    file,

    // @ts-ignore-error
    //
    // Ref is always a system type here
    type.values,
    validatorState,
  );

  fileContextSetIndent(file, -1);
  fileWrite(file, `}`);

  // Reset state;
  validatorState.validatedValuePath.pop();
  validatorState.reusedVariableIndex--;
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalBooleanDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptBoolean(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  if (!isNil(type.oneOf)) {
    fileWrite(
      file,
      `if (${valuePath} === ${type.oneOf} || ${valuePath} === "${
        type.oneOf
      }" || ${valuePath} === ${type.oneOf ? 1 : 0}) {`,
    );
    fileContextSetIndent(file, 1);
    fileWrite(file, `${resultPath} = ${type.oneOf};`);

    fileContextSetIndent(file, -1);
    fileWrite(file, `} else {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.oneOf",
  allowedValues: [${type.oneOf}],
};`,
    );

    fileContextSetIndent(file, -1);
    fileWrite(file, `}\n`);
  } else {
    fileWrite(
      file,
      `if (${valuePath} === true || ${valuePath} === "true" || ${valuePath} === 1) {`,
    );
    fileContextSetIndent(file, 1);
    fileWrite(file, `${resultPath} = true;`);

    fileContextSetIndent(file, -1);
    fileWrite(
      file,
      `} else if (${valuePath} === false || ${valuePath} === "false" || ${valuePath} === 0) {`,
    );
    fileContextSetIndent(file, 1);
    fileWrite(file, `${resultPath} = false;`);

    fileContextSetIndent(file, -1);
    fileWrite(file, `} else {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.type",
  expectedType: "boolean",
};`,
    );

    fileContextSetIndent(file, -1);
    fileWrite(file, `}\n`);
  }
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalDateDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptDate(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  if (type.specifier === "dateOnly") {
    fileWrite(file, fileFormatInlineComment(file, `yyyy-MM-dd`));
    fileWrite(
      file,
      `if (typeof ${valuePath} !== "string" || !(/^\\d{4}-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2][0-9])|(3[0-1]))$/gi).test(${valuePath})) {`,
    );
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.pattern",
  patternExplanation: "yyyy-MM-dd",
};`,
    );

    fileContextSetIndent(file, -1);
    fileWrite(file, `} else {`);
    fileContextSetIndent(file, 1);

    fileWrite(file, `${resultPath} = ${valuePath};`);

    fileContextSetIndent(file, -1);
    fileWrite(file, `}`);
  } else if (type.specifier === "timeOnly") {
    fileWrite(file, fileFormatInlineComment(file, `HH:mm(:ss(.SSS)`));
    fileWrite(
      file,
      `if (typeof ${valuePath} !== "string" || !(/^(([0-1][0-9])|(2[0-3])):[0-5][0-9](:[0-5][0-9](\\.\\d{3})?)?$/gi).test(${valuePath})) {`,
    );
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.pattern",
  patternExplanation: "HH:mm(:ss(.SSS)",
};`,
    );

    fileContextSetIndent(file, -1);
    fileWrite(file, `} else {`);
    fileContextSetIndent(file, 1);

    fileWrite(file, `${resultPath} = ${valuePath};`);

    fileContextSetIndent(file, -1);
    fileWrite(file, `}`);
  } else {
    fileWrite(
      file,
      `if (typeof ${valuePath} === "string" || typeof ${valuePath} === "number") {`,
    );

    fileContextSetIndent(file, 1);

    fileWrite(file, `${resultPath} = new Date(${valuePath});`);

    fileContextSetIndent(file, -1);
    fileWrite(
      file,
      `} else if (Object.prototype.toString.call(${valuePath}) === "[object Date]") {`,
    );
    fileContextSetIndent(file, 1);

    fileWrite(file, `${resultPath} = ${valuePath};`);

    fileContextSetIndent(file, -1);
    fileWrite(file, `} else {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.type",
  expectedType: "Date|string",
};`,
    );

    fileContextSetIndent(file, -1);
    fileWrite(file, `}`);

    // Note that `null` and `undefined` behave differently when passed to `isNaN`.
    fileWrite(file, `if (isNaN(${resultPath}?.getTime() ?? undefined)) {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.date.invalid",
};`,
    );

    fileContextSetIndent(file, -1);
    fileWrite(file, `} else {`);
    fileContextSetIndent(file, 1);

    if (!isNil(type.validator.min)) {
      fileWrite(
        file,
        `if (${valuePath} < new Date("${type.validator.min}")) {`,
      );
      fileContextSetIndent(file, 1);

      fileWrite(
        file,
        `${errorKey} = {
  key: "validator.range",
  minValue: new Date("${type.validator.min}"),
};`,
      );

      fileContextSetIndent(file, -1);
      fileWrite(file, `}\n`);
    }

    if (!isNil(type.validator.max)) {
      fileWrite(
        file,
        `if (${valuePath} > new Date("${type.validator.max}")) {`,
      );
      fileContextSetIndent(file, 1);

      fileWrite(
        file,
        `${errorKey} = {
  key: "validator.range",
  maxValue: new Date("${type.validator.max}")
};`,
      );

      fileContextSetIndent(file, -1);
      fileWrite(file, `}\n`);
    }

    if (type.validator.inFuture) {
      fileWrite(file, `if (${valuePath} < new Date()) {`);
      fileContextSetIndent(file, 1);

      fileWrite(
        file,
        `${errorKey} = {
  key: "validator.range",
  minValue: new Date(),
};`,
      );

      fileContextSetIndent(file, -1);
      fileWrite(file, `}\n`);
    }

    if (type.validator.inPast) {
      fileWrite(file, `if (${valuePath} > new Date()) {`);
      fileContextSetIndent(file, 1);

      fileWrite(
        file,
        `${errorKey} = {
  key: "validator.range",
  maxValue: new Date(),
};`,
      );

      fileContextSetIndent(file, -1);
      fileWrite(file, `}\n`);
    }

    fileContextSetIndent(file, -1);
    fileWrite(file, `}`);
  }
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalFileDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptFile(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  // const errorKey = formatErrorKey(validatorState);

  // This should always be a custom validator.
  fileWrite(file, `${resultPath} = ${valuePath};`);
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalGenericDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptGeneric(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  // TODO: implement
  fileWrite(
    file,
    fileFormatInlineComment(
      file,
      `
${valuePath}
${resultPath}
${errorKey}
`,
    ),
  );
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalNumberDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptNumber(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  fileWrite(file, `if (typeof ${valuePath} !== "number") {`);
  fileContextSetIndent(file, 1);

  fileWrite(file, `${valuePath} = Number(${valuePath});`);

  fileContextSetIndent(file, -1);
  fileWrite(file, "}");

  const conditionPartial = !type.validator.floatingPoint
    ? `|| !Number.isInteger(${valuePath})`
    : "";
  const subType = type.validator.floatingPoint ? "float" : "int";

  fileWrite(
    file,
    `if ( isNaN(${valuePath}) || !isFinite(${valuePath}) ${conditionPartial}) {`,
  );
  fileContextSetIndent(file, 1);

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
    fileWrite(file, `if (${valuePath} < ${type.validator.min}) {`);
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
    fileWrite(file, `if (${valuePath} > ${type.validator.max}) {`);
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
      .map((it) => `${valuePath} !== ${it}`)
      .join(" && ");

    fileWrite(file, `if (${condition}) {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.oneOf",
  allowedValues: [${type.oneOf.join(", ")}]
};`,
    );

    fileContextSetIndent(file, -1);
    fileWriteInline(file, `} else`);
  }

  fileWrite(file, `{`);
  fileContextSetIndent(file, 1);
  fileWrite(file, `${resultPath} = ${valuePath};`);

  fileContextSetIndent(file, -1);
  fileWrite(file, "} ");
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalObjectDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptObject(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  if (type.validator.strict) {
    const setVariable = `knownKeys${validatorState.reusedVariableIndex++}`;

    fileWrite(file, `const ${setVariable} = new Set([`);
    fileContextSetIndent(file, 1);
    for (const key of Object.keys(type.keys)) {
      fileWrite(file, `"${key}",`);
    }
    fileContextSetIndent(file, -1);
    fileWrite(file, `]);`);

    fileWrite(file, `for (const key of Object.keys(${valuePath})) {`);
    fileContextSetIndent(file, 1);
    fileWrite(file, `if (!${setVariable}.has(key)) {`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `${errorKey} = {
  key: "validator.keys",
  expectedKeys: [...${setVariable}],
  foundKeys: Object.keys(${valuePath}),
};`,
    );
    fileWrite(file, `break;`);

    fileContextSetIndent(file, -1);
    fileWrite(file, "}");
    fileContextSetIndent(file, -1);
    fileWrite(file, "}");

    validatorState.reusedVariableIndex--;
  }

  fileWrite(file, `${resultPath} = Object.create(null);\n`);

  for (const key of Object.keys(type.keys)) {
    validatorState.validatedValuePath.push({ type: "stringKey", key });

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
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalReferenceDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptReference(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  validatorState.dependingValidators.push(type);
  const ref = structureResolveReference(
    validatorState.generateContext.structure,
    type,
  );

  // @ts-ignore-error
  //
  // Ref is always a system type here
  const referredTypeName = typesCacheGet(ref, validatorState.outputTypeOptions);

  if (file.relativePath !== `${type.reference.group}/validators.js`) {
    const importCollector = JavascriptImportCollector.getImportCollector(file);
    importCollector.destructure(
      `../${type.reference.group}/validators.js`,
      `validate${referredTypeName}`,
    );
  }

  const intermediateVariable = `refResult${validatorState.reusedVariableIndex++}`;

  fileWrite(
    file,
    `const ${intermediateVariable} = validate${referredTypeName}(${valuePath});\n`,
  );

  fileWrite(file, `if (${intermediateVariable}.error) {`);
  fileContextSetIndent(file, 1);

  fileWrite(
    file,
    `for (const errorKey of Object.keys(${intermediateVariable}.error)) {`,
  );
  fileContextSetIndent(file, 1);

  fileWrite(
    file,
    `${errorKey.substring(
      0,
      errorKey.length - 2,
    )}$\{errorKey.substring(1)}\`] = ${intermediateVariable}.error[errorKey];`,
  );

  fileContextSetIndent(file, -1);
  fileWrite(file, `}`);

  fileContextSetIndent(file, -1);
  fileWrite(file, `}\n`);

  fileWrite(file, `${resultPath} = ${intermediateVariable}.value;`);

  validatorState.reusedVariableIndex--;
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalStringDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptString(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  // TODO: implement
  fileWrite(
    file,
    fileFormatInlineComment(
      file,
      `
${valuePath}
${resultPath}
${errorKey}
`,
    ),
  );
}

/**
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalUuidDefinition} type
 * @param {import("./generator").ValidatorState} validatorState
 */
export function validatorJavascriptUuid(file, type, validatorState) {
  const valuePath = formatValuePath(validatorState);
  const resultPath = formatResultPath(validatorState);
  const errorKey = formatErrorKey(validatorState);

  // TODO: implement
  fileWrite(
    file,
    fileFormatInlineComment(
      file,
      `
${valuePath}
${resultPath}
${errorKey}
`,
    ),
  );
}

/**
 * Finish the else block for nil checks.
 *
 * @param {import("../file/context").GenerateFile} file
 */
export function validatorJavascriptFinishElseBlock(file) {
  fileContextSetIndent(file, -1);
  fileWrite(file, `}\n`);
}

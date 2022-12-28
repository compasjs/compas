import { AppError, noop } from "@compas/stdlib";
import { referenceUtilsGetProperty } from "../processors/reference-utils.js";
import {
  structureNamedTypes,
  structureResolveReference,
} from "../processors/structure.js";
import { stringFormatNameForError } from "../string-format.js";
import { targetLanguageSwitch } from "../target/switcher.js";
import { typesCacheGet } from "../types/cache.js";
import {
  typesGeneratorGenerateNamedType,
  typesGeneratorIsOptional,
} from "../types/generator.js";
import {
  validatorJavascriptAny,
  validatorJavascriptAnyOf,
  validatorJavascriptArray,
  validatorJavascriptBoolean,
  validatorJavascriptDate,
  validatorJavascriptFile,
  validatorJavascriptFinishElseBlock,
  validatorJavascriptGeneric,
  validatorJavascriptGetFile,
  validatorJavascriptHasValidatorForOutputTypeName,
  validatorJavascriptNilCheck,
  validatorJavascriptNumber,
  validatorJavascriptObject,
  validatorJavascriptReference,
  validatorJavascriptStartValidator,
  validatorJavascriptStopValidator,
  validatorJavascriptString,
  validatorJavascriptUuid,
} from "./javascript.js";

/**
 * @typedef {{ type: "root"}
 *   |{ type: "stringKey", key: string}
 *   |{ type: "dynamicKey", key: string }
 * } ValidatorPath
 */

/**
 * @typedef {object} ValidatorState
 *
 * @property {import("../generate").GenerateContext} generateContext
 * @property {string} inputVariableName
 * @property {string} outputVariableName
 * @property {string} errorMapVariableName
 * @property {string} inputTypeName
 * @property {string} outputTypeName
 * @property {import("../types/generator").GenerateTypeOptions} outputTypeOptions
 * @property {number} reusedVariableIndex
 * @property {ValidatorPath[]} validatedValuePath
 * @property {import("../generated/common/types")
 * .ExperimentalReferenceDefinition[]
 * } dependingValidators
 */

/**
 * Generate all the 'validated' types in the provided structure. This means that, for
 * example, `defaults` are resolved, and things like `T.date()` are always in the
 * language native `Date` type.
 *
 * We skip `route` ad `crud` since these are not directly usable as types.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function validatorGeneratorGenerateBaseTypes(generateContext) {
  if (!generateContext.options.generators.validators?.includeBaseTypes) {
    return;
  }

  for (const type of structureNamedTypes(generateContext.structure)) {
    if (type.type === "route" || type.type === "crud") {
      continue;
    }

    validatorGeneratorGenerateValidator(generateContext, type, {
      validatorState: "output",
      typeOverrides: {},
      nameSuffix: "",
    });
  }
}

/**
 * Generate a named type for the target language. Skips if the cache already has a name
 * registered for the provided type and options.
 *
 * This does not return a way to use a type, this will be added later.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {import("../types/generator").GenerateTypeOptions} outputTypeOptions
 */
export function validatorGeneratorGenerateValidator(
  generateContext,
  type,
  outputTypeOptions,
) {
  /** @type {import("../types/generator").GenerateTypeOptions} */
  const inputTypeOptions = {
    ...outputTypeOptions,
    nameSuffix: `${outputTypeOptions.nameSuffix ?? ""}Input`,
    validatorState: "input",
  };

  // Prepare the types that we are using, this way we can fetch the name from the type
  // cache.
  typesGeneratorGenerateNamedType(generateContext, type, outputTypeOptions);
  typesGeneratorGenerateNamedType(generateContext, type, inputTypeOptions);

  const outputTypeName = typesCacheGet(type, outputTypeOptions);
  const inputTypeName = typesCacheGet(type, inputTypeOptions);

  if (!outputTypeName || !inputTypeName) {
    throw AppError.serverError({
      message: "Could not resolve type name",
      outputTypeOptions,
      inputTypeName,
      outputTypeName,
      type,
    });
  }

  const file = targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptGetFile,
      ts: noop,
    },
    [generateContext, type],
  );

  if (!file) {
    throw AppError.serverError({
      message: `Could not resolve validator file for ${stringFormatNameForError(
        type,
      )}.`,
    });
  }

  if (
    targetLanguageSwitch(
      generateContext,
      {
        js: validatorJavascriptHasValidatorForOutputTypeName,
        ts: noop,
      },
      [file, outputTypeName],
    ) === true
  ) {
    return;
  }

  /**
   * @type {ValidatorState}
   */
  const validatorState = {
    generateContext,
    reusedVariableIndex: 0,
    inputVariableName: "value",
    outputVariableName: "result",
    errorMapVariableName: "errorMap",
    validatedValuePath: [{ type: "root" }],
    inputTypeName,
    outputTypeName,
    outputTypeOptions,
    dependingValidators: [],
  };

  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptStartValidator,
      ts: noop,
    },
    [generateContext, file, type, validatorState],
  );

  validatorGeneratorGenerateBody(generateContext, file, type, validatorState);

  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptStopValidator,
      ts: noop,
    },
    [generateContext, file, validatorState],
  );

  for (const dependingValidator of validatorState.dependingValidators) {
    const ref = structureResolveReference(
      generateContext.structure,
      dependingValidator,
    );

    validatorGeneratorGenerateValidator(
      generateContext,

      // @ts-ignore-error
      //
      // Ref is always a system type here
      ref,
      outputTypeOptions,
    );
  }
}

/**
 * Generate the body of a validator. This function should be called and work for
 * recursive types as well.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
export function validatorGeneratorGenerateBody(
  generateContext,
  file,
  type,
  validatorState,
) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptNilCheck,
      ts: noop,
    },
    [
      file,
      validatorState,
      {
        isOptional: typesGeneratorIsOptional(generateContext, type, {
          ...validatorState.outputTypeOptions,
          validatorState: "input",
        }),
        defaultValue: referenceUtilsGetProperty(generateContext, type, [
          "defaultValue",
        ]),
        allowNull: referenceUtilsGetProperty(
          generateContext,
          type,
          ["validator", "allowNull"],
          false,
        ),
      },
    ],
  );

  if (validatorState.outputTypeOptions.typeOverrides[type.type]) {
    // TODO: language switch custom type override validator.
  }

  switch (type.type) {
    case "any":
      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorAny(generateContext, file, type, validatorState);
      break;
    case "anyOf":
      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorAnyOf(generateContext, file, type, validatorState);
      break;
    case "array":
      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorArray(generateContext, file, type, validatorState);
      break;
    case "boolean":
      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorBoolean(generateContext, file, type, validatorState);
      break;
    case "date":
      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorDate(generateContext, file, type, validatorState);
      break;
    case "file":
      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorFile(generateContext, file, type, validatorState);
      break;
    case "generic":
      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorGeneric(generateContext, file, type, validatorState);
      break;
    case "number":
      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorNumber(generateContext, file, type, validatorState);
      break;
    case "object":
      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorObject(generateContext, file, type, validatorState);
      break;
    case "reference":
      validatorState.dependingValidators.push(type);

      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorReference(generateContext, file, type, validatorState);
      break;
    case "string":
      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorString(generateContext, file, type, validatorState);
      break;
    case "uuid":
      // @ts-ignore-error
      //
      // Ref is always a system type here
      validatorGeneratorUuid(generateContext, file, type, validatorState);
      break;
  }

  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptFinishElseBlock,
      ts: noop,
    },
    [file],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorAny(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptAny,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorAnyOf(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptAnyOf,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorArray(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptArray,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorBoolean(
  generateContext,
  file,
  type,
  validatorState,
) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptBoolean,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorDate(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptDate,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorFile(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptFile,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorGeneric(
  generateContext,
  file,
  type,
  validatorState,
) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptGeneric,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorNumber(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptNumber,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorObject(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptObject,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorReference(
  generateContext,
  file,
  type,
  validatorState,
) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptReference,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorString(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptString,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorUuid(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptUuid,
      ts: noop,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

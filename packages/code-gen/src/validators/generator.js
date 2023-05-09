import { AppError } from "@compas/stdlib";
import { referenceUtilsGetProperty } from "../processors/reference-utils.js";
import {
  structureNamedTypes,
  structureResolveReference,
} from "../processors/structure.js";
import { stringFormatNameForError } from "../string-format.js";
import { targetLanguageSwitch } from "../target/switcher.js";
import { typesCacheGet } from "../types/cache.js";
import { typesGeneratorGenerateNamedType } from "../types/generator.js";
import { typesOptionalityIsOptional } from "../types/optionality.js";
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
  validatorJavascriptGetNameAndImport,
  validatorJavascriptNilCheck,
  validatorJavascriptNumber,
  validatorJavascriptObject,
  validatorJavascriptReference,
  validatorJavascriptStartValidator,
  validatorJavascriptStopValidator,
  validatorJavascriptString,
  validatorJavascriptUuid,
} from "./javascript.js";
import {
  validatorTypescriptGetFile,
  validatorTypescriptGetNameAndImport,
  validatorTypescriptStartValidator,
} from "./typescript.js";

/**
 * Cache for which type names we have written a validator in a file.
 *
 * File references are unique per generate context, so we use that as the cache key.
 *
 * @type {WeakMap<object, Set<string>>}
 */
const validatorCache = new WeakMap();

/**
 * @typedef {{ type: "root"}
 *   |{ type: "stringKey", key: string}
 *   |{ type: "dynamicKey", key: string }
 * } ValidatorPath
 */

/**
 * @typedef {object} ValidatorState
 * @property {import("../generate.js").GenerateContext} generateContext
 * @property {string} inputVariableName
 * @property {string} outputVariableName
 * @property {string} errorMapVariableName
 * @property {string} inputTypeName
 * @property {string} outputTypeName
 * @property {import("../types/generator.js").GenerateTypeOptions} outputTypeOptions
 * @property {number} reusedVariableIndex
 * @property {ValidatorPath[]} validatedValuePath
 * @property {import("../generated/common/types.js")
 * .ExperimentalReferenceDefinition[]
 * } dependingValidators
 * @property {boolean} [jsHasInlineTypes]
 * @property {boolean} [skipFirstNilCheck]
 */

/**
 * Generate all the 'validated' types in the provided structure. This means that, for
 * example, `defaults` are resolved, and things like `T.date()` are always in the
 * language native `Date` type.
 *
 * We skip `route` ad `crud` since these are not directly usable as types.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
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
      nameSuffixes: {
        input: "Input",
        output: "Validated",
      },
      targets: [generateContext.options.targetLanguage],
    });
  }
}

/**
 * Provides the validator function name and adds the import to the provided file for the
 * type.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {string} outputTypeName
 * @returns {string}
 */
export function validatorGetNameAndImport(
  generateContext,
  file,
  type,
  outputTypeName,
) {
  // @ts-expect-error
  return targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptGetNameAndImport,
      ts: validatorTypescriptGetNameAndImport,
    },
    [file, type, outputTypeName],
  );
}

/**
 * Generate a named type for the target language. Skips if the cache already has a name
 * registered for the provided type and options.
 *
 * TODO: Expand docs
 *
 * - How to use the types
 * - Duplication
 * - Resolved & unique names
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {import("../types/generator.js").GenerateTypeOptions & {
 *   preferInputBaseName?: boolean;
 * }} outputTypeOptions
 */
export function validatorGeneratorGenerateValidator(
  generateContext,
  type,
  outputTypeOptions,
) {
  /** @type {import("../types/generator.js").GenerateTypeOptions} */
  const inputTypeOptions = {
    ...outputTypeOptions,
    validatorState: "input",
  };

  // Prepare the types that we are using, this way we can fetch the name from the type
  // cache.
  if (outputTypeOptions.preferInputBaseName) {
    // Generate the input type first, this way it can get the 'normal' name without a suffix, improving usability
    typesGeneratorGenerateNamedType(generateContext, type, inputTypeOptions);
    typesGeneratorGenerateNamedType(generateContext, type, outputTypeOptions);
  } else {
    typesGeneratorGenerateNamedType(generateContext, type, outputTypeOptions);
    typesGeneratorGenerateNamedType(generateContext, type, inputTypeOptions);
  }

  const outputTypeName = typesCacheGet(
    generateContext,
    type,
    outputTypeOptions,
  );
  const inputTypeName = typesCacheGet(generateContext, type, inputTypeOptions);

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
      ts: validatorTypescriptGetFile,
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

  if (validatorCache.get(file)?.has(outputTypeName)) {
    return;
  }

  if (!validatorCache.has(file)) {
    validatorCache.set(file, new Set([outputTypeName]));
  } else {
    validatorCache.get(file)?.add(outputTypeName);
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
    jsHasInlineTypes: generateContext.options.targetLanguage === "ts",
  };

  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptStartValidator,
      ts: validatorTypescriptStartValidator,
    },
    [generateContext, file, type, validatorState],
  );

  validatorGeneratorGenerateBody(generateContext, file, type, validatorState);

  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptStopValidator,
      ts: validatorJavascriptStopValidator,
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
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
export function validatorGeneratorGenerateBody(
  generateContext,
  file,
  type,
  validatorState,
) {
  const skipNilCheck = validatorState.skipFirstNilCheck === true;
  validatorState.skipFirstNilCheck = undefined;

  if (!skipNilCheck) {
    targetLanguageSwitch(
      generateContext,
      {
        js: validatorJavascriptNilCheck,
        ts: validatorJavascriptNilCheck,
      },
      [
        file,
        validatorState,
        {
          isOptional: typesOptionalityIsOptional(generateContext, type, {
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

  if (!skipNilCheck) {
    targetLanguageSwitch(
      generateContext,
      {
        js: validatorJavascriptFinishElseBlock,
        ts: validatorJavascriptFinishElseBlock,
      },
      [file],
    );
  }
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorAny(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptAny,
      ts: validatorJavascriptAny,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorAnyOf(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptAnyOf,
      ts: validatorJavascriptAnyOf,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorArray(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptArray,
      ts: validatorJavascriptArray,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
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
      ts: validatorJavascriptBoolean,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorDate(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptDate,
      ts: validatorJavascriptDate,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorFile(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptFile,
      ts: validatorJavascriptFile,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
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
      ts: validatorJavascriptGeneric,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorNumber(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptNumber,
      ts: validatorJavascriptNumber,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorObject(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptObject,
      ts: validatorJavascriptObject,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
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
      ts: validatorJavascriptReference,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [generateContext, file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorString(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptString,
      ts: validatorJavascriptString,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

/**
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").ExperimentalTypeSystemDefinition>} type
 * @param {ValidatorState} validatorState
 */
function validatorGeneratorUuid(generateContext, file, type, validatorState) {
  targetLanguageSwitch(
    generateContext,
    {
      js: validatorJavascriptUuid,
      ts: validatorJavascriptUuid,
    },

    // @ts-ignore-error
    //
    // Ref is always a system type here
    [file, type, validatorState],
  );
}

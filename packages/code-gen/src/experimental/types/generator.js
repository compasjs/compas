import { AppError } from "@compas/stdlib";
import {
  structureNamedTypes,
  structureResolveReference,
} from "../processors/structure.js";
import { targetLanguageSwitch } from "../target/switcher.js";
import { typesCacheGet } from "./cache.js";
import {
  typesTypescriptEndDeclareGlobal,
  typesTypescriptGenerateNamedType,
  typesTypescriptHasDeclaredTypes,
  typesTypescriptInitFile,
  typesTypescriptResolveFile,
  typesTypescriptStartDeclareGlobal,
} from "./typescript.js";

/**
 * @typedef {object} GenerateTypeOptions
 * @property {"input"|"output"} validatorState
 * @property {Partial<Record<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition["type"],
 *   string
 * >>} typeOverrides
 * @property {string} [nameSuffix]
 */

/**
 * Init the types generator. It doesn't necessary need to be enabled, cause other
 * generators will automatically add types when necessary.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function typesGeneratorInit(generateContext) {
  const file = targetLanguageSwitch(
    generateContext,
    {
      js: typesTypescriptInitFile,
      ts: typesTypescriptInitFile,
    },
    [generateContext],
  );

  if (!file) {
    throw AppError.serverError({
      message: `Missing file creator for target language '${generateContext.options.targetLanguage}'.`,
    });
  }

  targetLanguageSwitch(
    generateContext,
    {
      js: typesTypescriptStartDeclareGlobal,
      ts: typesTypescriptStartDeclareGlobal,
    },
    [generateContext, file],
  );

  if (generateContext.options.generators.types?.includeBaseTypes) {
    typesGeneratorGenerateBaseTypes(generateContext);
  }

  // TODO: Compas global types
}

/**
 * Finalize the generated file.
 * It also checks if types where added to this file. When no types are added, we remove
 * it from the generateContext.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function typesGeneratorFinalize(generateContext) {
  const file = targetLanguageSwitch(
    generateContext,
    {
      js: typesTypescriptResolveFile,
      ts: typesTypescriptResolveFile,
    },
    [generateContext],
  );

  if (!file) {
    throw AppError.serverError({
      message: `Could not find the types file. Did you call 'typesGeneratorInit'?`,
    });
  }

  targetLanguageSwitch(
    generateContext,
    {
      js: typesTypescriptEndDeclareGlobal,
      ts: typesTypescriptEndDeclareGlobal,
    },
    [generateContext, file],
  );

  const hasDeclaredTypes = targetLanguageSwitch(
    generateContext,
    {
      js: typesTypescriptHasDeclaredTypes,
      ts: typesTypescriptHasDeclaredTypes,
    },
    [file],
  );

  if (hasDeclaredTypes === false) {
    // We shouldn't generate an empty types file, so remove it from the context.
    for (const [
      relativePath,
      generateFile,
    ] of generateContext.files.entries()) {
      if (generateFile === file) {
        generateContext.files.delete(relativePath);
      }
    }
  }
}

/**
 * Generate all the 'validated' types in the provided structure. This means that, for
 * example, `defaults` are resolved, and things like `T.date()` are always in the
 * language native `Date` type.
 *
 * We skip `route` ad `crud` since these are not directly usable as types.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
function typesGeneratorGenerateBaseTypes(generateContext) {
  for (const type of structureNamedTypes(generateContext.structure)) {
    if (type.type === "route" || type.type === "crud") {
      continue;
    }

    typesGeneratorGenerateNamedType(generateContext, type);
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
 */
export function typesGeneratorGenerateNamedType(generateContext, type) {
  // TODO: accept options argument
  /** @type {GenerateTypeOptions} */
  const options = {
    validatorState: "output",
    typeOverrides: {},
    nameSuffix: "",
  };

  if (typesCacheGet(type, options)) {
    return;
  }

  targetLanguageSwitch(
    generateContext,
    {
      js: typesTypescriptGenerateNamedType,
      ts: typesTypescriptGenerateNamedType,
    },
    [generateContext, type, options],
  );
}

/**
 * Check if the provided type should be generated as an optional type.
 * When {@link options.validatorState} is set to 'output', we expect that defaults are
 * applied.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {import("./generator").GenerateTypeOptions} options
 * @returns {boolean}
 */
export function typesGeneratorIsOptional(generateContext, type, options) {
  const referencedType =
    type.type === "reference"
      ? structureResolveReference(generateContext.structure, type)
      : undefined;

  if (options.validatorState === "input") {
    return type.isOptional || (referencedType?.isOptional ?? false);
  } else if (options.validatorState === "output") {
    if (
      (type.isOptional || (referencedType?.isOptional ?? false)) &&
      (type.defaultValue || referencedType?.defaultValue)
    ) {
      return false;
    }

    return type.isOptional || (referencedType?.isOptional ?? false);
  }

  return false;
}

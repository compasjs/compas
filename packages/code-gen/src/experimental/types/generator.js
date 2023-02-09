import { AppError } from "@compas/stdlib";
import { referenceUtilsGetProperty } from "../processors/reference-utils.js";
import { structureNamedTypes } from "../processors/structure.js";
import { targetLanguageSwitch } from "../target/switcher.js";
import { typesCacheGet } from "./cache.js";
import { typesJavascriptUseTypeName } from "./javascript.js";
import {
  typesTypescriptEndDeclareGlobal,
  typesTypescriptGenerateNamedType,
  typesTypescriptHasDeclaredTypes,
  typesTypescriptInitFile,
  typesTypescriptResolveFile,
  typesTypescriptStartDeclareGlobal,
  typesTypescriptUseTypeName,
} from "./typescript.js";

/**
 * @typedef {object} GenerateTypeOptions
 * @property {"input"|"output"} validatorState
 * @property {string} nameSuffix
 * @property {(import("../generated/common/types.js").ExperimentalAnyDefinitionTarget
 *  )[]} targets
 */

/**
 * Init the types generator. It doesn't necessary need to be enabled, cause other
 * generators will automatically add types when necessary.
 *
 * TODO: expand docs
 *
 * - supported targets
 * -
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

    typesGeneratorGenerateNamedType(generateContext, type, {
      validatorState: "output",
      nameSuffix: "",
      targets: [generateContext.options.targetLanguage],
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
 * @param {GenerateTypeOptions} options
 */
export function typesGeneratorGenerateNamedType(
  generateContext,
  type,
  options,
) {
  if (typesCacheGet(generateContext, type, options)) {
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
 * Use the provided type name in the provided file
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {string} name
 * @returns {string}
 */
export function typesGeneratorUseTypeName(generateContext, file, name) {
  return (
    targetLanguageSwitch(
      generateContext,
      {
        js: typesJavascriptUseTypeName,
        ts: typesTypescriptUseTypeName,
      },
      [generateContext, file, name],
    ) ?? name
  );
}

/**
 * Check if the provided type should be generated as an optional type.
 * When {@link options.validatorState} is set to 'output', we expect that defaults are
 * applied.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {Pick<import("./generator").GenerateTypeOptions, "validatorState">} options
 * @returns {boolean}
 */
export function typesGeneratorIsOptional(generateContext, type, options) {
  if (options.validatorState === "input") {
    return referenceUtilsGetProperty(
      generateContext,
      type,
      ["isOptional"],
      false,
    );
  } else if (options.validatorState === "output") {
    if (
      referenceUtilsGetProperty(generateContext, type, ["isOptional"], false) &&
      referenceUtilsGetProperty(generateContext, type, ["defaultValue"], false)
    ) {
      return false;
    }

    return referenceUtilsGetProperty(
      generateContext,
      type,
      ["isOptional"],
      false,
    );
  }

  return false;
}

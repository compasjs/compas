import { AppError } from "@compas/stdlib";
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
 * @property {{
 *   input: string,
 *   output: string,
 * }} nameSuffixes
 * @property {(import("../generated/common/types.d.ts").StructureAnyDefinitionTarget
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
 * @param {import("../generate.js").GenerateContext} generateContext
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
 * @param {import("../generate.js").GenerateContext} generateContext
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

  const hasDeclaredTypes = targetLanguageSwitch(
    generateContext,
    {
      js: typesTypescriptHasDeclaredTypes,
      ts: typesTypescriptHasDeclaredTypes,
    },
    [file],
  );

  targetLanguageSwitch(
    generateContext,
    {
      js: typesTypescriptEndDeclareGlobal,
      ts: typesTypescriptEndDeclareGlobal,
    },
    [generateContext, file],
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
 * @param {import("../generate.js").GenerateContext} generateContext
 */
function typesGeneratorGenerateBaseTypes(generateContext) {
  for (const type of structureNamedTypes(generateContext.structure)) {
    if (type.type === "route" || type.type === "crud") {
      continue;
    }

    typesGeneratorGenerateNamedType(generateContext, type, {
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
 * Generate a named type for the target language. Skips if the cache already has a name
 * registered for the provided type and options.
 *
 * This does not return a way to use a type, this will be added later.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types").NamedType<
 *   import("../generated/common/types").StructureTypeSystemDefinition
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
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
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

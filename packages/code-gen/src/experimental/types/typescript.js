import { isNil } from "@compas/stdlib";
import { upperCaseFirst } from "../../utils.js";
import {
  fileContextCreateGeneric,
  fileContextGet,
  fileContextSetIndent,
} from "../file/context.js";
import { fileFormatInlineComment } from "../file/format.js";
import {
  fileWrite,
  fileWriteInline,
  fileWriteLinePrefix,
  fileWriteNewLine,
  fileWriteRaw,
} from "../file/write.js";
import { structureResolveReference } from "../processors/structure.js";
import { typeDefinitionTraverse } from "../processors/type-definition-traverse.js";
import { TypescriptImportCollector } from "../target/typescript.js";
import {
  typesCacheAdd,
  typesCacheGet,
  typesCacheGetUsedNames,
} from "./cache.js";
import { typesGeneratorIsOptional } from "./generator.js";

/**
 * Resolve the `types.d.ts` output file.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {import("../file/context").GenerateFile}
 */
export function typesTypescriptResolveFile(generateContext) {
  return fileContextGet(generateContext, "common/types.d.ts");
}

/**
 * Create the `types.d.ts` output file. The base settings of the
 * {@link import("../file/context").GenerateFile} align with the Typescript output.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {import("../file/context").GenerateFile}
 */
export function typesTypescriptInitFile(generateContext) {
  return fileContextCreateGeneric(generateContext, "common/types.d.ts", {
    importCollector: new TypescriptImportCollector(),
  });
}

/**
 * Start a `declare global` block to generate all types in the global namespace. This is
 * only a good fit in the end result of an application, where TS in JSDoc is used,
 * preventing a bunch of unnecessary inline imports.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 */
export function typesTypescriptStartDeclareGlobal(generateContext, file) {
  if (generateContext.options.generators.types?.declareGlobalTypes) {
    fileWrite(file, `declare global {`);
    fileContextSetIndent(file, 1);
  }
}

/**
 * End global type declarations if necessary.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 */
export function typesTypescriptEndDeclareGlobal(generateContext, file) {
  if (generateContext.options.generators.types?.declareGlobalTypes) {
    fileContextSetIndent(file, -1);
    fileWrite(file, `}`);
  }
}

/**
 * Since we always start the types file, we need to check if we declared any types. When
 * we don't have any types, the type generator will remove this file.
 *
 * @param {import("../file/context").GenerateFile} file
 */
export function typesTypescriptHasDeclaredTypes(file) {
  if (file.contents.match(/declare global \{\s+}/gim)) {
    return false;
  }

  return file.contents.trim().length !== 0;
}

/**
 * Add a named type to the output.
 *
 * When generating TS types, we need to make sure that referenced types are resolved
 * earlier, since references need this to format their reference name.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {import("./generator").GenerateTypeOptions} options
 */
export function typesTypescriptGenerateNamedType(
  generateContext,
  type,
  options,
) {
  if (typesCacheGet(type, options)) {
    // We already have this type, so we can skip it.
    return;
  }

  const file = typesTypescriptResolveFile(generateContext);
  const name = typesTypescriptFormatTypeName(type, options);

  // Make sure that nested references exists before we generate this type.
  // TODO: check if we should move this logic up in to the generator
  typeDefinitionTraverse(
    type,
    (type, callback) => {
      callback(type);
    },
    {
      isInitialType: true,
      assignResult: false,
      beforeTraversal: () => {},
      afterTraversal: (nestedType) => {
        if (nestedType.type !== "reference") {
          return;
        }

        // By resolving the type after reversal, all its dependent
        // types are already resolved.
        const resolvedReference = structureResolveReference(
          generateContext.structure,
          nestedType,
        );

        if (resolvedReference === type) {
          // A type references itself, so we can ignore it.
          return;
        }

        typesTypescriptGenerateNamedType(
          generateContext,

          // @ts-expect-error
          resolvedReference,
          options,
        );
      },
    },
  );

  if (type.docString) {
    fileWrite(file, fileFormatInlineComment(file, type.docString));
  }

  fileWriteLinePrefix(file);

  if (generateContext.options.generators.types?.declareGlobalTypes) {
    fileWriteRaw(file, `type ${name} = `);
  } else {
    fileWriteRaw(file, `export type ${name} = `);
  }

  typesTypescriptFormatType(generateContext, file, type, options);

  fileWrite(file, `;`);
  fileWriteNewLine(file);
}

/**
 * Format and write the type. Uses inline writes where possible.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalTypeSystemDefinition} type
 * @param {import("./generator").GenerateTypeOptions} options
 * @returns {void}
 */
export function typesTypescriptFormatType(
  generateContext,
  file,
  type,
  options,
) {
  const isOptional = typesGeneratorIsOptional(generateContext, type, options);

  let optionalStr = `|undefined`;

  // @ts-expect-error
  //
  // Not all types have support for `allowNull` in their validators.
  if (type?.validator?.allowNull) {
    optionalStr += "|null";
  }

  if (!isNil(options.typeOverrides[type.type])) {
    // @ts-expect-error
    //
    // We have this typed as a partial, so all values could be undefined, even though we
    // check this in the if-statement.
    //
    // If the type has an override, we skip any of the
    // default behavior.
    fileWriteInline(file, options.typeOverrides[type.type]);
    fileWriteInline(file, optionalStr);

    return;
  }

  if (type.type === "reference") {
    const resolvedReference = structureResolveReference(
      generateContext.structure,
      type,
    );

    // @ts-expect-error
    const resolvedName = typesCacheGet(resolvedReference, options);
    fileWriteInline(file, `${resolvedName}`);

    if (isOptional) {
      fileWriteInline(file, optionalStr);
    }
  } else if (type.type === "any") {
    // TODO: handle imports
    if (type.rawValue) {
      fileWriteInline(file, type.rawValue);
    } else {
      fileWriteInline(file, `any`);
    }

    if (isOptional) {
      fileWriteInline(file, optionalStr);
    }
  } else if (type.type === "anyOf") {
    fileContextSetIndent(file, 1);

    for (const value of type.values) {
      fileWriteNewLine(file);
      fileWriteInline(file, `|`);
      typesTypescriptFormatType(generateContext, file, value, options);
    }

    if (isOptional) {
      // Note that one the of the underlying types could be optional as well. At this
      // point we are then just writing a duplicated case.
      fileWriteNewLine(file);
      fileWriteInline(file, optionalStr);
    }

    fileContextSetIndent(file, -1);
  } else if (type.type === "array") {
    fileWriteInline(file, `(`);

    typesTypescriptFormatType(generateContext, file, type.values, options);
    fileWriteInline(file, `)`);
    fileWriteInline(file, `[]`);

    if (options.validatorState === "input") {
      fileWriteInline(file, "|");
      typesTypescriptFormatType(generateContext, file, type.values, options);
    }

    if (isOptional) {
      fileWriteInline(file, optionalStr);
    }
  } else if (type.type === "boolean") {
    if (!isNil(type.oneOf)) {
      fileWriteInline(file, `${type.oneOf}`);

      if (options.validatorState === "input") {
        fileWriteInline(file, `|"${type.oneOf}"`);
      }
    } else {
      fileWriteInline(file, `boolean`);

      if (options.validatorState === "input") {
        fileWriteInline(file, `|"true"|"false"`);
      }
    }

    if (isOptional) {
      fileWriteInline(file, optionalStr);
    }
  } else if (type.type === "date") {
    if (options.validatorState === "input") {
      fileWriteInline(file, `Date|string|number`);
    } else if (type.specifier) {
      fileWriteInline(file, "string");
    } else {
      fileWriteInline(file, `Date`);
    }

    if (isOptional) {
      fileWriteInline(file, optionalStr);
    }
  } else if (type.type === "file") {
    if (options.validatorState === "input") {
      fileWriteInline(file, `{ name?; string, data: Blob}`);
    } else {
      fileWriteInline(file, "Blob");
    }

    if (isOptional) {
      fileWriteInline(file, optionalStr);
    }
  } else if (type.type === "generic") {
    fileWriteInline(file, `Record<`);
    fileContextSetIndent(file, 1);
    fileWriteNewLine(file);

    typesTypescriptFormatType(generateContext, file, type.keys, options);
    fileWriteInline(file, `,`);
    fileWriteNewLine(file);

    typesTypescriptFormatType(generateContext, file, type.values, options);
    fileContextSetIndent(file, -1);
    fileWriteInline(file, `>`);

    if (isOptional) {
      fileWriteInline(file, optionalStr);
    }
  } else if (type.type === "number") {
    if (type.oneOf) {
      fileWriteInline(file, type.oneOf.join("|"));

      if (options.validatorState === "input") {
        fileWriteInline(file, `|"`);
        fileWriteInline(file, type.oneOf.join(`"|"`));
        fileWriteInline(file, `"`);
      }
    } else {
      fileWriteInline(file, `number`);
    }

    if (isOptional) {
      fileWriteInline(file, optionalStr);
    }
  } else if (type.type === "object") {
    fileContextSetIndent(file, 1);
    fileWriteInline(file, `{`);

    for (const key of Object.keys(type.keys)) {
      fileWriteNewLine(file);
      if (type.keys[key].docString) {
        fileWrite(file, "");
        fileWrite(
          file,
          fileFormatInlineComment(file, type.keys[key].docString),
        );
      }

      const subIsOptional = typesGeneratorIsOptional(
        generateContext,
        type.keys[key],
        options,
      );

      if (subIsOptional) {
        fileWriteInline(file, `${key}?: `);
      } else {
        fileWriteInline(file, `${key}: `);
      }

      typesTypescriptFormatType(generateContext, file, type.keys[key], options);
      fileWriteInline(file, `;`);
    }

    fileContextSetIndent(file, -1);
    fileWriteNewLine(file);
    fileWriteInline(file, `}`);

    if (isOptional) {
      fileWriteInline(file, optionalStr);
    }
  } else if (type.type === "string") {
    if (type.oneOf) {
      fileWriteInline(file, `"`);
      fileWriteInline(file, type.oneOf.join(`"|"`));
      fileWriteInline(file, `"`);
    } else {
      fileWriteInline(file, `string`);
    }

    if (isOptional) {
      fileWriteInline(file, optionalStr);
    }
  } else if (type.type === "uuid") {
    fileWriteInline(file, `string`);

    if (isOptional) {
      fileWriteInline(file, optionalStr);
    }
  }
}

/**
 * Format a name for the provided type and options.
 *
 * We prefer to use the base name. This means that the order of operations in the
 * generators is important for the cleanest result. If the base name is used, we try a
 * variant with the suffix.
 *
 * When both are used we try to append a `_1`, `_2` etc., until we find an unused unique
 * type name.
 *
 * The used type is directly registered in the cache.
 *
 * @param {import("../types").NamedType<
 *   import("../generated/common/types").ExperimentalTypeSystemDefinition
 * >} type
 * @param {import("./generator").GenerateTypeOptions} options
 * @returns {string}
 */
function typesTypescriptFormatTypeName(type, options) {
  const usedNames = typesCacheGetUsedNames(type);

  const baseName = `${upperCaseFirst(type.group)}${upperCaseFirst(type.name)}`;

  if (!usedNames.includes(baseName)) {
    typesCacheAdd(type, options, baseName);
    return baseName;
  }

  const withSuffix = `${baseName}${upperCaseFirst(options.nameSuffix)}`;

  if (!usedNames.includes(withSuffix)) {
    typesCacheAdd(type, options, withSuffix);
    return withSuffix;
  }

  let numberedSuffix = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const currentName = `${withSuffix}_${numberedSuffix}`;

    if (!usedNames.includes(currentName)) {
      typesCacheAdd(type, options, currentName);
      return currentName;
    }

    numberedSuffix += 1;
  }
}

/**
 * Use the provided name in Typescript
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {string} name
 * @returns {string}
 */
export function typesTypescriptUseTypeName(generateContext, file, name) {
  if (generateContext.options.generators.types?.declareGlobalTypes) {
    return name;
  }

  const importCollector = TypescriptImportCollector.getImportCollector(file);
  importCollector.destructure(`../common/types`, name);

  return name;
}

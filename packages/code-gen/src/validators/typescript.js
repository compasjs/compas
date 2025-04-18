import { fileBlockStart } from "../file/block.js";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextGetOptional,
  fileContextRemoveLinePrefix,
} from "../file/context.js";
import { fileWrite } from "../file/write.js";
import { JavascriptImportCollector } from "../target/javascript.js";
import { typesGeneratorUseTypeName } from "../types/generator.js";

/**
 *
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types.d.ts").NamedType<
 *   import("../generated/common/types.d.ts").StructureTypeSystemDefinition
 * >} type
 * @param {string} outputTypeName
 * @returns {string}
 */
export function validatorTypescriptGetNameAndImport(
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
 * Get or create a Javascript validation file for the group that the type belongs to.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../../types/advanced-types.d.ts").NamedType<
 *   import("../generated/common/types.d.ts").StructureTypeSystemDefinition
 * >} type
 * @returns {import("../file/context.js").GenerateFile}
 */
export function validatorTypescriptGetFile(generateContext, type) {
  const relativePath = `${type.group}/validators.ts`;

  const existingFile = fileContextGetOptional(generateContext, relativePath);

  if (existingFile) {
    return existingFile;
  }

  const file = fileContextCreateGeneric(generateContext, relativePath, {
    importCollector: new JavascriptImportCollector(),
    typeImportCollector:
      generateContext.options.targetLanguage === "ts" ?
        new JavascriptImportCollector(true)
      : undefined,

    additionToGeneratedByComment: "@ts-nocheck",
  });

  fileWrite(
    file,
    `
type Either<T, E> = { value: T; error?: never }|{ value?: never; error: E };

type ValidatorErrorMap = Record<string, any|undefined>;

// eslint-disable-next-line unused-imports/no-unused-vars
const isRecord = (v: unknown): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v);
`,
  );

  return file;
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
export function validatorTypescriptStartValidator(
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
  }

  // Finish the JSDoc block
  fileWrite(file, "/");
  fileContextRemoveLinePrefix(file, 2);

  // Initialize the function
  fileBlockStart(
    file,
    `export function validate${validatorState.outputTypeName}(${
      validatorState.inputVariableName
    }: ${typesGeneratorUseTypeName(
      generateContext,
      file,
      validatorState.inputTypeName,
    )}|unknown): Either<${typesGeneratorUseTypeName(
      generateContext,
      file,
      validatorState.outputTypeName,
    )}, ValidatorErrorMap>`,
  );

  // We also initialize the error handling and result variable
  fileWrite(
    file,
    `const ${validatorState.errorMapVariableName}: ValidatorErrorMap = {};`,
  );
  fileWrite(
    file,
    `let ${validatorState.outputVariableName}: any = undefined;\n`,
  );
}

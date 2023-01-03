/**
 * Generate a utils file that can be used by other generators.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function jsPostgresGenerateUtils(
  generateContext: import("../generate").GenerateContext,
): void;
/**
 * Create a file for the provided model
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @returns {import("../file/context").GenerateFile}
 */
export function jsPostgresCreateFile(
  generateContext: import("../generate").GenerateContext,
  model: import("../types").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
): import("../file/context").GenerateFile;
/**
 * Generate the where query function and specification
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateWhere(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  model: import("../types").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
  contextNames: import("./generator").DatabaseContextNames,
): void;
/**
 * Generate the insert query function
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateInsert(
  generateContext: import("../generate").GenerateContext,
  file: import("../file/context").GenerateFile,
  model: import("../types").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
  contextNames: import("./generator").DatabaseContextNames,
): void;
//# sourceMappingURL=js-postgres.d.ts.map

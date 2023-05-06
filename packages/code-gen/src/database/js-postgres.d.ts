/**
 * Generate a utils file that can be used by other generators.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function jsPostgresGenerateUtils(
  generateContext: import("../generate.js").GenerateContext,
): void;
/**
 * Create a file for the provided model
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../types.js").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @returns {import("../file/context.js").GenerateFile}
 */
export function jsPostgresCreateFile(
  generateContext: import("../generate.js").GenerateContext,
  model: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
): import("../file/context.js").GenerateFile;
/**
 * Generate the where query function and specification
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../types.js").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateWhere(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  model: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
  contextNames: import("./generator.js").DatabaseContextNames,
): void;
/**
 * Generate the order by query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../types.js").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateOrderBy(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  model: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
  contextNames: import("./generator.js").DatabaseContextNames,
): void;
/**
 * Generate the count query function. This is the only result that doesn't return a
 * wrapped query part.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../types.js").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateCount(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  model: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
  contextNames: import("./generator.js").DatabaseContextNames,
): void;
/**
 * Generate the insert query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../types.js").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateInsert(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  model: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
  contextNames: import("./generator.js").DatabaseContextNames,
): void;
/**
 * Generate the upsert on primary key query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../types.js").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateUpsertOnPrimaryKey(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  model: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
  contextNames: import("./generator.js").DatabaseContextNames,
): void;
/**
 * Generate the update query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../types.js").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateUpdate(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  model: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
  contextNames: import("./generator.js").DatabaseContextNames,
): void;
/**
 * Generate the delete query function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../types.js").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateDelete(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  model: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
  contextNames: import("./generator.js").DatabaseContextNames,
): void;
/**
 * Generate the query builder spec and wrapper function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../types.js").NamedType<import("../generated/common/types").ExperimentalObjectDefinition>} model
 * @param {import("./generator.js").DatabaseContextNames} contextNames
 */
export function jsPostgresGenerateQueryBuilder(
  generateContext: import("../generate.js").GenerateContext,
  file: import("../file/context.js").GenerateFile,
  model: import("../types.js").NamedType<
    import("../generated/common/types").ExperimentalObjectDefinition
  >,
  contextNames: import("./generator.js").DatabaseContextNames,
): void;
//# sourceMappingURL=js-postgres.d.ts.map

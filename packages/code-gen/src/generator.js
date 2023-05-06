import { readFileSync } from "fs";
import {
  AppError,
  environment,
  isNil,
  isProduction,
  loggerGetPrettyPrinter,
  loggerSetGlobalDestination,
  newLogger,
  pathJoin,
} from "@compas/stdlib";
import { buildOrInfer } from "./builders/index.js";
import { generateExecute } from "./generate.js";
import { validateExperimentalGenerateOptions } from "./generated/experimental/validators.js";
import {
  structureAddType,
  structureExtractGroups,
  structureIncludeReferences,
  structureNamedTypes,
} from "./processors/structure.js";

/**
 * Compas code-gen entrypoint.
 *
 * TODO: expand the docs
 */
export class Generator {
  /**
   * @param {import("@compas/stdlib").Logger} [logger]
   */
  constructor(logger) {
    if (
      isNil(logger) &&
      environment.CI !== "true" &&
      (!isProduction() || isNil(environment.NODE_ENV))
    ) {
      // Work nicely when the user doesn't use `mainFn` and doesn't explicitly set
      // NODE_ENV. Normally, we default to production behaviour when `NODE_ENV` is not
      // set, but we expect the generator to only be used in dev contexts.
      loggerSetGlobalDestination(
        loggerGetPrettyPrinter({ addGitHubActionsAnnotations: false }),
      );
    }

    /**
     * @type {import("@compas/stdlib").Logger}
     */
    this.logger = logger ?? newLogger();

    /**
     * @type {import("./generated/common/types.js").ExperimentalStructure}
     */
    this.internalStructure = {};
  }

  /**
   * Add new type definitions to this generator
   *
   * @param {...import("../types/advanced-types.js").TypeBuilderLike} builders
   * @returns {Generator}
   */
  add(...builders) {
    for (let i = 0; i < builders.length; i++) {
      const builder = builders[i];
      try {
        structureAddType(this.internalStructure, buildOrInfer(builder), {
          skipReferenceExtraction: false,
        });
      } catch (/** @type {any} */ e) {
        throw AppError.serverError(
          {
            message: `Could not add builder to the structure`,
            index: i,
            builder,
          },
          e,
        );
      }
    }

    return this;
  }

  /**
   * Add an existing structure to this generator.
   * If a string is provided, it is expected to be a path to a 'structure.json' or to an
   * 'outputDirectory' of a generate call that included 'structure: {}'.
   *
   * @param {import("./generated/common/types.js").ExperimentalStructure|string} structureOrDirectory
   * @returns {Generator}
   */
  addStructure(structureOrDirectory) {
    if (typeof structureOrDirectory === "string") {
      if (!structureOrDirectory.endsWith("common/structure.json")) {
        structureOrDirectory = pathJoin(
          structureOrDirectory,
          "common/structure.json",
        );
      }

      structureOrDirectory = JSON.parse(
        readFileSync(structureOrDirectory, "utf-8"),
      );
    }

    // @ts-expect-error
    //
    // We already converted a string to a valid structure above.
    for (const namedDefinition of structureNamedTypes(structureOrDirectory)) {
      structureAddType(this.internalStructure, namedDefinition, {
        skipReferenceExtraction: true,
      });
    }

    return this;
  }

  /**
   * Select a subset of groups from this generator and set them on a new generator.
   * This includes all references that are used in the current group.
   *
   * @param {string[]} groups
   * @returns {Generator}
   */
  selectGroups(groups) {
    const nextGenerator = new Generator(this.logger);

    // Extract groups + create a deep copy
    nextGenerator.internalStructure = JSON.parse(
      JSON.stringify(structureExtractGroups(this.internalStructure, groups)),
    );

    return nextGenerator;
  }

  /**
   * Select a subset of types from this generator and set them on a new generator.
   * This includes all references that are used in these types.
   *
   * @param {{group: string, name: string}[]} typeNames
   * @returns {Generator}
   */
  selectTypes(typeNames) {
    const nextGenerator = new Generator(this.logger);

    for (const typeName of typeNames) {
      const namedType = this.internalStructure[typeName.group]?.[typeName.name];

      if (!namedType) {
        throw AppError.serverError({
          message:
            "Could not select the type from this generator, as it is not known.",
          typeName,
        });
      }

      structureAddType(nextGenerator.internalStructure, namedType, {
        skipReferenceExtraction: true,
      });

      structureIncludeReferences(
        this.internalStructure,
        nextGenerator.internalStructure,
        namedType,
      );
    }

    // Create a deep copy.
    nextGenerator.internalStructure = JSON.parse(
      JSON.stringify(nextGenerator.internalStructure),
    );

    return nextGenerator;
  }

  /**
   * Generate based on the structure that is known to this generator
   *
   * @param {import("./generated/common/types.js").ExperimentalGenerateOptionsInput} options
   * @returns {import("./generate.js").OutputFile[]}
   */
  generate(options) {
    const validationResultOptions =
      validateExperimentalGenerateOptions(options);
    if (validationResultOptions.error) {
      throw AppError.serverError({
        message: "Static validation failed for the provided options.",
        error: validationResultOptions.error,
      });
    }

    return generateExecute(this, validationResultOptions.value);
  }
}

import { mkdirSync, rmSync, writeFileSync } from "fs";
import { AppError, isNil, pathJoin } from "@compas/stdlib";
import { fileContextConvertToOutputFiles } from "./file/context.js";
import {
  validateExperimentalGenerateOptions,
  validateExperimentalStructure,
} from "./generated/experimental/validators.js";
import { docStringCleanup } from "./processors/doc-string.js";
import {
  modelKeyAddDateKeys,
  modelKeyAddPrimary,
} from "./processors/model-keys.js";
import {
  modelPartialInsertTypes,
  modelPartialReturningTypes,
  modelPartialUpdateTypes,
} from "./processors/model-partials.js";
import {
  modelRelationAddKeys,
  modelRelationBuildRelationInformationCache,
  modelRelationCheckAllRelations,
} from "./processors/model-relation.js";
import {
  modelSortAllKeys,
  modelSortAllRelations,
} from "./processors/model-sort.js";
import {
  modelWhereBuildWhereInformation,
  modelWhereBuildWhereTypes,
} from "./processors/model-where.js";
import { objectExpansionExecute } from "./processors/object-expansion.js";
import { structureNameChecks } from "./processors/structure-name-checks.js";
import {
  structureCopyAndSort,
  structureValidateReferences,
} from "./processors/structure.js";
import { structureGenerator } from "./structure/generator.js";
import {
  typesGeneratorFinalize,
  typesGeneratorInit,
} from "./types/generator.js";
import { validatorGeneratorGenerateBaseTypes } from "./validators/generator.js";

/**
 * @typedef {object} OutputFile
 * @property {string} contents
 * @property {string} relativePath
 */

/**
 * @typedef {object} GenerateContext
 * @property {import("@compas/stdlib").Logger} log
 * @property {import("./generated/common/types.js").ExperimentalGenerateOptions} options
 * @property {import("./generated/common/types.js").ExperimentalStructure} structure
 * @property {import("./file/context").GenerateFileMap} files
 */

/**
 * Execute the generators based on de provided Generator instance and included options.
 *
 * @param {import("./generator").Generator} generator
 * @param {import("./generated/common/types").ExperimentalGenerateOptions} options
 * @returns {OutputFile[]}
 */
export function generateExecute(generator, options) {
  // TODO: migrate to new validators
  const validationResultOptions = validateExperimentalGenerateOptions(options);
  const validationResultStructure = validateExperimentalStructure(
    generator.internalStructure,
  );

  if (validationResultOptions.error) {
    throw AppError.serverError(
      {
        message: "Static validation failed for the provided options.",
      },
      validationResultOptions.error,
    );
  }

  if (validationResultStructure.error) {
    throw AppError.serverError(
      {
        message: "Static validation on the structure failed",
      },
      validationResultStructure.error,
    );
  }

  options = validationResultOptions.value;

  // TODO: support generate presets
  // TODO: write migration docs between old and new code gen

  structureValidateReferences(generator.internalStructure);
  const structure = structureCopyAndSort(generator.internalStructure);

  const generateContext = {
    log: generator.logger,
    options: options,
    structure,
    files: new Map(),
  };

  structureGenerator(generateContext);

  structureNameChecks(generateContext);
  objectExpansionExecute(generateContext);

  modelKeyAddPrimary(generateContext);
  modelKeyAddDateKeys(generateContext);

  modelRelationCheckAllRelations(generateContext);
  modelRelationAddKeys(generateContext);
  modelRelationBuildRelationInformationCache(generateContext);

  modelSortAllRelations(generateContext);
  modelSortAllKeys(generateContext);

  modelWhereBuildWhereInformation(generateContext);
  modelWhereBuildWhereTypes(generateContext);

  modelPartialReturningTypes(generateContext);
  modelPartialInsertTypes(generateContext);
  modelPartialUpdateTypes(generateContext);

  docStringCleanup(generateContext);

  typesGeneratorInit(generateContext);
  validatorGeneratorGenerateBaseTypes(generateContext);

  // All other generator output logic should be between here (A)

  typesGeneratorFinalize(generateContext);

  const outputFiles = fileContextConvertToOutputFiles(generateContext);
  generateWriteOutputFiles(generateContext, outputFiles);

  return outputFiles;
}

/**
 * Write output files if an output directory is provided
 *
 * @param {GenerateContext} generateContext
 * @param {OutputFile[]} outputFiles
 */
export function generateWriteOutputFiles(generateContext, outputFiles) {
  if (isNil(generateContext.options.outputDirectory)) {
    return;
  }

  rmSync(generateContext.options.outputDirectory, {
    recursive: true,
    force: true,
  });

  mkdirSync(generateContext.options.outputDirectory);

  for (const file of outputFiles) {
    if (file.relativePath.includes("/")) {
      const subDirectory = file.relativePath.split("/").slice(0, -1).join("/");

      mkdirSync(
        pathJoin(generateContext.options.outputDirectory, subDirectory),
        {
          recursive: true,
        },
      );
    }

    writeFileSync(
      pathJoin(generateContext.options.outputDirectory, file.relativePath),
      file.contents,
      "utf-8",
    );
  }
}

import { mkdirSync, rmSync, writeFileSync } from "fs";
import { AppError, isNil, pathJoin } from "@compas/stdlib";
import {
  validateExperimentalGenerateOptions,
  validateExperimentalStructure,
} from "./generated/experimental/validators.js";
import {
  modelKeyAddDateKeys,
  modelKeyAddPrimary,
} from "./processors/model-keys.js";
import {
  modelRelationAddKeys,
  modelRelationBuildRelationInformationCache,
  modelRelationCheckAllRelations,
} from "./processors/model-relation.js";
import {
  modelSortAllKeys,
  modelSortAllRelations,
} from "./processors/model-sort.js";
import { objectExpansionExecute } from "./processors/object-expansion.js";
import { structureNameChecks } from "./processors/structure-name-checks.js";
import {
  structureCopyAndSort,
  structureValidateReferences,
} from "./processors/structure.js";
import { structureGenerator } from "./structure/generator.js";

/**
 * @typedef {object} GenerateContext
 * @property {import("@compas/stdlib").Logger} log
 * @property {import("./generated/common/types.js").ExperimentalGenerateOptions} options
 * @property {import("./generated/common/types.js").ExperimentalStructure} structure
 * @property {{
 *   contents: string,
 *   relativePath: string,
 * }[]} outputFiles
 */

/**
 * Execute the generators based on de provided Generator instance and included options.
 *
 * @param {import("./generator").Generator} generator
 * @param {import("./generated/common/types").ExperimentalGenerateOptions} options
 * @returns {GenerateContext["outputFiles"]}
 */
export function generateExecute(generator, options) {
  // TODO: migrate to new validators
  const validationResultOptions = validateExperimentalGenerateOptions(options);
  const validationResultStructure = validateExperimentalStructure(
    generator.initialStructure,
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

  structureValidateReferences(generator.initialStructure);
  const structure = structureCopyAndSort(generator.initialStructure);

  const generateContext = {
    log: generator.logger,
    options: options,
    structure,
    outputFiles: [],
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

  generateWriteOutputFiles(generateContext);

  return generateContext.outputFiles;
}

/**
 * Write output files if an output directory is provided
 *
 * @param {GenerateContext} generateContext
 */
export function generateWriteOutputFiles(generateContext) {
  if (isNil(generateContext.options.outputDirectory)) {
    return;
  }

  rmSync(generateContext.options.outputDirectory, {
    recursive: true,
    force: true,
  });

  mkdirSync(generateContext.options.outputDirectory);

  for (const file of generateContext.outputFiles) {
    if (file.relativePath.includes("/")) {
      const subDirectory = file.relativePath.split("/").slice(0, -1).join("/");

      mkdirSync(
        pathJoin(generateContext.options.outputDirectory, subDirectory),
      );
    }

    writeFileSync(
      pathJoin(generateContext.options.outputDirectory, file.relativePath),
      file.contents,
      "utf-8",
    );
  }
}

import { mkdirSync, rmSync, writeFileSync } from "fs";
import { AppError, isNil, pathJoin } from "@compas/stdlib";
import { apiClientGenerator } from "./api-client/generator.js";
import { crudEventsGenerate } from "./crud/events.js";
import { crudHandlersGenerate } from "./crud/handlers.js";
import { databaseGenerator } from "./database/generator.js";
import { fileContextConvertToOutputFiles } from "./file/context.js";
import { validateExperimentalStructure } from "./generated/experimental/validators.js";
import { openApiGenerate } from "./open-api/generator.js";
import { anyOfPreProcess } from "./processors/any-of.js";
import { crudTypesCreate } from "./processors/crud-types.js";
import { crudValidation } from "./processors/crud-validation.js";
import { docStringCleanup } from "./processors/doc-string.js";
import {
  modelKeyAddDateKeys,
  modelKeyAddPrimary,
} from "./processors/model-keys.js";
import { modelNameValidation } from "./processors/model-name.js";
import {
  modelPartialInsertTypes,
  modelPartialOrderByTypes,
  modelPartialReturningTypes,
  modelPartialUpdateTypes,
} from "./processors/model-partials.js";
import {
  modelQueryBuilderTypes,
  modelQueryResultTypes,
} from "./processors/model-query.js";
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
import { routeInvalidationsCheck } from "./processors/route-invalidation.js";
import { routeStructureCreate } from "./processors/route-structure.js";
import { routeTrieBuild } from "./processors/route-trie.js";
import { structureNameChecks } from "./processors/structure-name-checks.js";
import {
  structureCopyAndSort,
  structureValidateReferences,
} from "./processors/structure.js";
import { routerGenerator } from "./router/generator.js";
import { structureGenerator } from "./structure/generator.js";
import { targetValidateCombinations } from "./target/validation.js";
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
 * TODO: expand docs
 *
 * - flat structure, no resolved references
 * - Preprocess everything
 * - talk about caching
 * - targetLanguageSwitch & targetCustomSwitch
 *
 * @param {import("./generator").Generator} generator
 * @param {import("./generated/common/types").ExperimentalGenerateOptions} options
 * @returns {OutputFile[]}
 */
export function generateExecute(generator, options) {
  const validationResultStructure = validateExperimentalStructure(
    generator.internalStructure,
  );

  if (validationResultStructure.error) {
    throw AppError.serverError({
      message: "Static validation on the structure failed",
      error: validationResultStructure.error,
    });
  }

  structureValidateReferences(generator.internalStructure);

  const structure = structureCopyAndSort(generator.internalStructure);

  const generateContext = {
    log: generator.logger,
    options: options,
    structure,
    files: new Map(),
  };

  targetValidateCombinations(generateContext);

  structureGenerator(generateContext);

  structureNameChecks(generateContext);
  objectExpansionExecute(generateContext);

  modelNameValidation(generateContext);

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
  modelPartialOrderByTypes(generateContext);

  modelQueryBuilderTypes(generateContext);
  modelQueryResultTypes(generateContext);

  crudValidation(generateContext);
  crudTypesCreate(generateContext);

  routeInvalidationsCheck(generateContext);
  routeStructureCreate(generateContext);
  routeTrieBuild(generateContext);

  anyOfPreProcess(generateContext);
  docStringCleanup(generateContext);

  typesGeneratorInit(generateContext);

  databaseGenerator(generateContext);

  routerGenerator(generateContext);
  apiClientGenerator(generateContext);

  openApiGenerate(generateContext);

  crudEventsGenerate(generateContext);
  crudHandlersGenerate(generateContext);

  validatorGeneratorGenerateBaseTypes(generateContext);

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

  mkdirSync(generateContext.options.outputDirectory, {
    recursive: true,
  });

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

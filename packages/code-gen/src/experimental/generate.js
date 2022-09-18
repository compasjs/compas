import { mkdirSync, rmSync, writeFileSync } from "fs";
import { isNil, pathJoin } from "@compas/stdlib";
import {
  structureCopyAndSort,
  structureValidateReferences,
} from "./structure.js";
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
  // TODO: validate generate options
  // TODO: support generate presets
  // TODO: write migration docs between old and new code gen
  // TODO: statically validate structure

  // TODO: start with infrastructure
  //  - general checks and structure behaviour like expanding CRUD, resolving relations
  //    etc.
  //  - per generator logic
  //  - per generator writers for different languages, runtimes, libraries
  structureValidateReferences(generator.initialStructure);
  const structure = structureCopyAndSort(generator.initialStructure);

  const ctx = {
    log: generator.logger,
    options: options,
    structure,
    outputFiles: [],
  };

  structureGenerator(ctx);

  // TODO: pick up from preprocessors

  generateWriteOutputFiles(ctx);

  return ctx.outputFiles;
}

/**
 * Write output files if an output directory is provided
 *
 * @param {GenerateContext} ctx
 */
export function generateWriteOutputFiles(ctx) {
  if (isNil(ctx.options.outputDirectory)) {
    return;
  }

  rmSync(ctx.options.outputDirectory, {
    recursive: true,
    force: true,
  });

  mkdirSync(ctx.options.outputDirectory);

  for (const file of ctx.outputFiles) {
    if (file.relativePath.includes("/")) {
      const subDirectory = file.relativePath.split("/").slice(0, -1).join("/");

      mkdirSync(pathJoin(ctx.options.outputDirectory, subDirectory));
    }

    writeFileSync(
      pathJoin(ctx.options.outputDirectory, file.relativePath),
      file.contents,
      "utf-8",
    );
  }
}

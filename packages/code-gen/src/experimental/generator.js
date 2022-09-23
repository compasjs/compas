import { readFileSync } from "fs";
import { pathJoin } from "@compas/stdlib";
import { buildOrInfer } from "../builders/index.js";
import { generateExecute } from "./generate.js";
import {
  structureAddType,
  structureExtractGroups,
  structureNamedTypes,
} from "./processors/structure.js";

export class Generator {
  /**
   * @param {import("@compas/stdlib").Logger} logger
   */
  constructor(logger) {
    /**
     * @type {import("@compas/stdlib").Logger}
     */
    this.logger = logger;

    /**
     * @type {import("./generated/common/types").ExperimentalStructure}
     */
    this.initialStructure = {};

    /**
     * @private
     * @type {import("./generated/common/types").ExperimentalStructure[]}
     */
    this.structures = [this.initialStructure];
  }

  /**
   * Add new type definitions to this generator
   *
   * @param {...import("../../types/advanced-types").TypeBuilderLike} types
   * @returns {Generator}
   */
  add(...types) {
    for (const t of types) {
      // @ts-expect-error we probably won't ever type this.
      structureAddType(this.initialStructure, buildOrInfer(t), {
        skipReferencesCheck: false,
      });
    }

    return this;
  }

  /**
   * Add an existing structure to this generator.
   * If a string is provided, it is expected to be a path to a 'structure.json' or to an
   * 'outputDirectory' of a generate call that included 'structure: {}'.
   *
   * @param {import("./generated/common/types").ExperimentalStructure|string} structureOrDirectory
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

      this.structures.push(
        JSON.parse(readFileSync(structureOrDirectory, "utf-8")),
      );
    } else {
      this.structures.push(structureOrDirectory);
    }

    // TODO: run validation

    /** @type {import("./generated/common/types").ExperimentalStructure} */
    const newStructure = this.structures.at(-1) ?? {};
    for (const namedDefinition of structureNamedTypes(newStructure)) {
      structureAddType(this.initialStructure, namedDefinition, {
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
    nextGenerator.initialStructure = structureExtractGroups(
      this.initialStructure,
      groups,
    );

    return nextGenerator;
  }

  /**
   * Generate based on the structure that is known to this generator
   *
   * @param {import("./generated/common/types").ExperimentalGenerateOptions} options
   * @returns {import("./generate").GenerateContext["outputFiles"]}
   */
  generate(options) {
    return generateExecute(this, options);
  }
}

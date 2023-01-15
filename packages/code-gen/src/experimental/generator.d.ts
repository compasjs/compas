/**
 * Compas code-gen entrypoint.
 *
 * TODO: expand the docs
 */
export class Generator {
  /**
   * @param {import("@compas/stdlib").Logger} logger
   */
  constructor(logger: import("@compas/stdlib").Logger);
  /**
   * @type {import("@compas/stdlib").Logger}
   */
  logger: import("@compas/stdlib").Logger;
  /**
   * @type {import("./generated/common/types").ExperimentalStructure}
   */
  internalStructure: import("./generated/common/types").ExperimentalStructure;
  /**
   * Add new type definitions to this generator
   *
   * @param {...import("../../types/advanced-types").TypeBuilderLike} builders
   * @returns {Generator}
   */
  add(
    ...builders: import("../../types/advanced-types").TypeBuilderLike[]
  ): Generator;
  /**
   * Add an existing structure to this generator.
   * If a string is provided, it is expected to be a path to a 'structure.json' or to an
   * 'outputDirectory' of a generate call that included 'structure: {}'.
   *
   * @param {import("./generated/common/types").ExperimentalStructure|string} structureOrDirectory
   * @returns {Generator}
   */
  addStructure(
    structureOrDirectory:
      | import("./generated/common/types").ExperimentalStructure
      | string,
  ): Generator;
  /**
   * Select a subset of groups from this generator and set them on a new generator.
   * This includes all references that are used in the current group.
   *
   * @param {string[]} groups
   * @returns {Generator}
   */
  selectGroups(groups: string[]): Generator;
  /**
   * Select a subset of types from this generator and set them on a new generator.
   * This includes all references that are used in these types.
   *
   * @param {{group: string, name: string}[]} typeNames
   * @returns {Generator}
   */
  selectTypes(
    typeNames: {
      group: string;
      name: string;
    }[],
  ): Generator;
  /**
   * Generate based on the structure that is known to this generator
   *
   * @param {import("./generated/common/types").ExperimentalGenerateOptions} options
   * @returns {import("./generate").OutputFile[]}
   */
  generate(
    options: import("./generated/common/types").ExperimentalGenerateOptions,
  ): import("./generate").OutputFile[];
}
//# sourceMappingURL=generator.d.ts.map

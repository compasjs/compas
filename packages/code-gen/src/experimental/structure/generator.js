import { isNil } from "@compas/stdlib";

/**
 * Run the structure generator.
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function structureGenerator(generateContext) {
  if (!structureIsEnabled(generateContext)) {
    return;
  }

  generateContext.structure.compas = generateContext.structure.compas ?? {};

  // @ts-expect-error
  //
  // The provided options are not a valid type definition, but we need to keep them in
  // the structure, so we just force assign it.
  generateContext.structure.compas.$options = generateContext.options;

  generateContext.outputFiles.push({
    contents: JSON.stringify(generateContext.structure, null, 2),
    relativePath: "common/structure.json",
  });

  delete generateContext.structure.compas.$options;
}

/**
 * Check if we should dump the structure
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @returns {boolean}
 */
export function structureIsEnabled(generateContext) {
  return !isNil(generateContext.options.generators.structure);
}

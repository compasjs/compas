import { isNil } from "@compas/stdlib";
import { fileContextCreateGeneric } from "../file/context.js";
import { fileWriteRaw } from "../file/write.js";

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

  const file = fileContextCreateGeneric(
    generateContext,
    "common/structure.json",
    {
      addGeneratedByComment: false,
    },
  );

  fileWriteRaw(file, JSON.stringify(generateContext.structure, null, 2));

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

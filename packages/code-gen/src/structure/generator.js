import { isNil } from "@compas/stdlib";
import { fileContextCreateGeneric } from "../file/context.js";
import { fileWriteRaw } from "../file/write.js";

/**
 * Run the structure generator.
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function structureGenerator(generateContext) {
  if (!structureIsEnabled(generateContext)) {
    return;
  }

  const file = fileContextCreateGeneric(
    generateContext,
    "common/structure.json",
    {
      addGeneratedByComment: false,
    },
  );

  fileWriteRaw(file, JSON.stringify(generateContext.structure, null, 2));
}

/**
 * Check if we should dump the structure
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {boolean}
 */
export function structureIsEnabled(generateContext) {
  return !isNil(generateContext.options.generators.structure);
}

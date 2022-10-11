import { isNil } from "@compas/stdlib";

/**
 * Run the structure generator.
 *
 * @param {import("../generate").GenerateContext} ctx
 */
export function structureGenerator(ctx) {
  if (!structureIsEnabled(ctx)) {
    return;
  }

  ctx.structure.compas = ctx.structure.compas ?? {};

  // @ts-expect-error
  //
  // The provided options are not a valid type definition, but we need to keep them in
  // the structure, so we just force assign it.
  ctx.structure.compas.$options = ctx.options;

  ctx.outputFiles.push({
    contents: JSON.stringify(ctx.structure, null, 2),
    relativePath: "common/structure.json",
  });

  delete ctx.structure.compas.$options;
}

/**
 * Check if we should dump the structure
 *
 * @param {import("../generate").GenerateContext} ctx
 * @returns {boolean}
 */
export function structureIsEnabled(ctx) {
  return !isNil(ctx.options.generators.structure);
}

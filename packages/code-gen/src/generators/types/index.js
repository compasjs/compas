import { generate, init, preGenerate } from "./generator.js";

/**
 *
 * @type {GeneratorPlugin}
 */
export const typeGenerator = {
  name: "type",
  init,
  preGenerate,
  generate,
};

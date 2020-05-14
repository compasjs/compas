import { generate, preGenerate } from "./generator.js";

/**
 *
 * @type {GeneratorPlugin}
 */
export const typeGenerator = {
  name: "type",
  preGenerate,
  generate,
};

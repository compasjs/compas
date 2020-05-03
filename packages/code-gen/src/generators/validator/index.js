import { generate, init, preGenerate } from "./generator.js";

/**
 *
 * @type {GeneratorPlugin}
 */
export const validatorGenerator = {
  name: "validator",
  init,
  preGenerate,
  generate,
};

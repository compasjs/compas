import { generate, init } from "./generator.js";

/**
 *
 * @type {GeneratorPlugin}
 */
export const validatorGenerator = {
  name: "validator",
  init,
  generate,
};

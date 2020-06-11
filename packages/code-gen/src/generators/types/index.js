import { generate, init } from "./generator.js";

/**
 *
 * @type {GeneratorPlugin}
 */
export const typeGenerator = {
  name: "type",
  init,
  generate,
};

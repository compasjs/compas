import { generate, init } from "./generator.js";

/**
 * @type {GeneratorPlugin}
 */
export const mockGenerator = {
  name: "mock",
  init,
  generate,
};

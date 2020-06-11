import { generate, init } from "./generator.js";

/**
 * @type {GeneratorPlugin}
 */
export const apiClientGenerator = {
  name: "apiClient",
  init,
  generate,
};

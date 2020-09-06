import { generate } from "./generator.js";

/**
 * @type {GeneratorPlugin}
 */
export const apiClientGenerator = {
  name: "apiClient",
  generate,
};

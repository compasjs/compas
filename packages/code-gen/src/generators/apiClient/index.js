import { generate, preGenerate } from "./generator.js";

/**
 * @type {GeneratorPlugin}
 */
export const apiClientGenerator = {
  name: "apiClient",
  preGenerate,
  generate,
};

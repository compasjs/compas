import {
  generate,
  generateStubs,
  preGenerate,
  preGenerateStubs,
} from "./generator.js";

/**
 * @type {GeneratorPlugin}
 */
export const apiClientGenerator = {
  name: "apiClient",
  preGenerate,
  generate,
  preGenerateStubs,
  generateStubs,
};

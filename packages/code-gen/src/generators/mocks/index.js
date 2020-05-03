import {
  generate,
  generateStubs,
  preGenerate,
  preGenerateStubs,
} from "./generator.js";

/**
 * @type {GeneratorPlugin}
 */
export const mockGenerator = {
  name: "mock",
  preGenerate,
  generate,
  preGenerateStubs,
  generateStubs,
};

import { generate, preGenerate } from "./generator.js";

/**
 * @type {GeneratorPlugin}
 */
export const mockGenerator = {
  name: "mock",
  preGenerate,
  generate,
};

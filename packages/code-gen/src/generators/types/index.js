import {
  generate,
  generateStubs,
  preGenerate,
  preGenerateStubs,
} from "./generator.js";

/**
 *
 * @type {GeneratorPlugin}
 */
export const typeGenerator = {
  name: "type",
  preGenerate,
  generate,
  preGenerateStubs,
  generateStubs,
};

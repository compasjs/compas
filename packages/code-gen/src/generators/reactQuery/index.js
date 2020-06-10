import { generate, init, preGenerate } from "./generator.js";

/**
 * @type {GeneratorPlugin}
 */
export const reactQueryGenerator = {
  name: "reactQuery",
  init,
  preGenerate,
  generate,
};

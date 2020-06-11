import { generate, preGenerate } from "./generator.js";

/**
 * @type {GeneratorPlugin}
 */
export const reactQueryGenerator = {
  name: "reactQuery",
  preGenerate,
  generate,
};

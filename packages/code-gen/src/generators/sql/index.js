import { generate, init, preGenerate } from "./generator.js";

/**
 *
 * @type {GeneratorPlugin}
 */
export const sqlGenerator = {
  name: "sql",
  init,
  preGenerate,
  generate,
};

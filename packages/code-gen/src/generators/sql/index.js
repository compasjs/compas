import { generate, preGenerate } from "./generator.js";

/**
 *
 * @type {GeneratorPlugin}
 */
export const sqlGenerator = {
  name: "sql",
  preGenerate,
  generate,
};

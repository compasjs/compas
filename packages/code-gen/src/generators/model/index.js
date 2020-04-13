import { dumpStore, generate, init } from "./generator.js";

export { M } from "./ModelBuilder.js";

/**
 *
 * @type {GeneratorPlugin}
 */
export const modelGenerator = {
  name: "model",
  init,
  dumpStore,
  generate,
};

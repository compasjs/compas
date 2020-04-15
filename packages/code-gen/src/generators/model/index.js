import "./ModelBuilder.js";
import { dumpStore, generate, init } from "./generator.js";

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

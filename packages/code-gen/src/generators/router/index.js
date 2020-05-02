import { dumpStore, generate, init, preProcessStore } from "./generator.js";

/**
 * @type {GeneratorPlugin}
 */
export const routerGenerator = {
  name: "router",
  init,
  preProcessStore,
  dumpStore,
  generate,
};

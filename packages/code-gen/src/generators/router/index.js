import { dumpStore, generate, init, preProcessStore } from "./generator.js";
export { R } from "./RouteBuilder.js";

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

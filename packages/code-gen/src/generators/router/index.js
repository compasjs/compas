import {
  dumpStore,
  generate,
  init,
  preProcessStore,
  registerTypes,
} from "./generator.js";

/**
 * @type {GeneratorPlugin}
 */
export const routerGenerator = {
  name: "router",
  registerTypes,
  init,
  preProcessStore,
  dumpStore,
  generate,
};

import { generate, init, preGenerate } from "./generator.js";
import "./type.js";

/**
 * @type {GeneratorPlugin}
 */
export const routerGenerator = {
  name: "router",
  init,
  preGenerate,
  generate,
};

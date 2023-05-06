/**
 * @typedef {import("./src/builders/TypeBuilder").TypeBuilder} TypeBuilder
 */

/**
 * @typedef {import("./types/advanced-types").TypeBuilderLike} TypeBuilderLike
 */

/**
 * @typedef {import("./src/builders/index.js").RouteCreator} RouteCreator
 */

export { TypeCreator } from "./src/builders/index.js";
export { Generator } from "./src/generator.js";
export {
  loadApiStructureFromRemote,
  loadApiStructureFromOpenAPI,
} from "./src/loaders.js";

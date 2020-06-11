import { App, TypeCreator } from "@lbu/code-gen";
import { storeStructure } from "@lbu/store";

/**
 * Apply dependencies
 *
 * @param {App} app
 */
export function extendWithDependencies(app) {
  app.extend(storeStructure);
}

/**
 * Internal structures
 *
 * @param {App} app
 */
export function extendWithInternal(app) {
  const T = new TypeCreator("app");
  app.add(T.bool("Test"));
}

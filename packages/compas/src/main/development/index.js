import { State } from "./state.js";

/**
 *
 * @param {import("../../shared/config.js").ConfigEnvironment} env
 * @returns {Promise<void>}
 */
export async function developmentMode(env) {
  const state = new State(env);

  await state.init();
}

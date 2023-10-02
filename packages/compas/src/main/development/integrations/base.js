/**
 * @typedef {object} Integration
 * @property {() => string} getStaticName The returned value is used in error handling,
 *   debug logging, but otherwise not specially handled.
 * @property {(state: import("../state.js").State) => (Promise<void>|void)} [onColdStart] Items
 *   to execute on a cold start. At this point, we don't have any existing cache yet.
 *   However, earlier running integrations may have populated some fields already.
 * @property {(state: import("../state.js").State) => (Promise<void>|void)} [onCachedStart] The
 *   cache is already primed. Could be used for registering items via
 *   {@link import("./state.js").State#registerAsyncTask}.
 * @property {(state: import("../state.js").State, changes: {
 *   filePaths: string[],
 * }) => (Promise<void>|void)} [onExternalChanges] Handle any change in the project.
 */

/**
 * @type {import("./base.js").Integration}
 */
export const _baseIntegration = {
  getStaticName() {
    return "_base";
  },
};

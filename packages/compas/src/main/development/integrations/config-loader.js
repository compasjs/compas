import { configResolveProjectConfig } from "../../../shared/config.js";

/**
 * @type {import("./base.js").Integration}
 */
export const configLoaderIntegration = {
  getStaticName() {
    return "configLoader";
  },

  async onColdStart(state) {
    state.cache.config = await configResolveProjectConfig();
  },

  async onExternalChanges(state, { filePaths }) {
    if (!filePaths.some((it) => it.endsWith("config/compas.json"))) {
      return;
    }

    const originalConfig = JSON.stringify(state.cache.config);

    try {
      state.cache.config = await configResolveProjectConfig();

      if (JSON.stringify(state.cache.config) !== originalConfig) {
        state.logInformation("Reloaded config due to file change.");
      }
    } catch (/** @type {any} */ e) {
      if (e.key === "config.resolve.parseError") {
        state.logInformation(`Could not reload config due to a syntax error.`);
      } else if (e.key === "config.resolve.validationError") {
        state.logInformation(
          `Could not reload config due to a validation error. Check the docs for supported properties.`,
        );
      } else {
        state.logInformation(
          `Could not reload the config due to an error. Please check your file.`,
        );
      }
    }
  },
};

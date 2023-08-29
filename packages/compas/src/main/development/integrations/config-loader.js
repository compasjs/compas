import { configResolveProjectConfig } from "../../../shared/config.js";
import { BaseIntegration } from "./base.js";

export class ConfigLoaderIntegration extends BaseIntegration {
  constructor(state) {
    super(state, "configLoader");
  }

  async init() {
    await super.init();

    if (!this.state.cache.config) {
      this.state.cache.config = await configResolveProjectConfig();

      await this.state.emitCacheUpdated();
      await this.state.emitConfigUpdated();
    }

    this.state.fileChangeRegister.push({
      glob: "**/config/compas.json",
      integration: this,
      debounceDelay: 50,
    });
  }

  async onFileChanged(paths) {
    await super.onFileChanged(paths);

    try {
      this.state.cache.config = await configResolveProjectConfig();

      await this.state.emitCacheUpdated();
      await this.state.emitConfigUpdated();

      this.state.logInformation("Reloaded config, due to file change.");
    } catch (/** @type {any} */ e) {
      if (e.key === "config.resolve.parseError") {
        this.state.logInformation(
          `Could not reload config due to a syntax error.`,
        );
      } else if (e.key === "config.resolve.validationError") {
        this.state.logInformation(
          `Could not reload config due to a validation error. Check the docs for supported properties.`,
        );
      } else {
        this.state.logInformation(
          `Could not reload the config due to an error. Please check your file.`,
        );
      }
    }
  }
}

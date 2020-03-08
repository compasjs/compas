import { App } from "../core/index.js";
import { plugin } from "./builderPlugin.js";

App.withPlugin(plugin);

/**
 * @name App#validator
 * @function
 * @param {...ModelBuilder} models
 * @return {App}
 */
App.prototype.validator = function(...models) {
  for (const model of models) {
    this.callHook("addValidator", model);
  }

  return this;
};

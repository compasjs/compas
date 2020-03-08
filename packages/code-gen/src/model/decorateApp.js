import { App } from "../core/index.js";

import { plugin } from "./builderPlugin.js";

App.withPlugin(plugin);

/**
 * @name App#model
 * @function
 * @param {...ModelBuilder} models
 * @return {App}
 */
App.prototype.model = function(...models) {
  for (const model of models) {
    this.callHook("addModel", model);
  }

  return this;
};

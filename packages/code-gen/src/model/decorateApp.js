import { App } from "../core/index.js";

import { plugin } from "./builderPlugin.js";

App.withPlugin(plugin);

/**
 * @name App#model
 * @function
 * @param {ModelBuilder} model
 * @return {App}
 */
App.prototype.model = function(model) {
  this.callHook("addModel", true, model);

  return this;
};

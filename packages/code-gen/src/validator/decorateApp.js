import { App } from "../core/index.js";
import { plugin } from "./builderPlugin.js";

App.withPlugin(plugin);

/**
 * @name App#validator
 * @function
 * @param {ModelBuilder} model
 * @return {App}
 */
App.prototype.validator = function(model) {
  this.callHook("addValidator", true, model);

  return this;
};

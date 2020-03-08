import { App } from "../core/index.js";
import { plugin } from "./builderPlugin.js";

App.withPlugin(plugin);

/**
 * @name App#route
 * @function
 * @param {...RouteBuilder} routes
 * @return {App}
 */
App.prototype.route = function(...routes) {
  for (const route of routes) {
    this.callHook("addRoute", route);
  }

  return this;
};

/**
 * @typedef {{
 *   init?: Function,
 *   process?: Function,
 *   build?: Function
 * }} AppPlugin
 */

/**
 * @type {AppPlugin[]}
 * @private
 */
const _plugins = [];

export class App {
  /**
   * @param {string} name
   */
  constructor(name) {
    /**
     * @private
     * @type {string}
     */
    this.name = name;

    /**
     * @private
     * @type {boolean}
     */
    this.isBuild = false;

    /**
     * @private
     */
    this.hooks = {};

    this.callPlugins("init", this);
  }

  /**
   * @param {AppPlugin} plugin
   */
  static withPlugin(plugin) {
    _plugins.push(plugin);
  }

  /**
   * @private
   */
  callPlugins(method, ...args) {
    for (const plugin of _plugins) {
      if (method in plugin) {
        plugin[method](...args);
      }
    }
  }

  /**
   * @private
   * @param {string} hookName
   * @param {...*} args
   */
  callHook(hookName, ...args) {
    if (hookName in this.hooks) {
      this.hooks[hookName](...args);
    }
  }

  build() {
    if (this.isBuild) {
      throw new Error("Can only call build once.");
    }
    this.isBuild = true;

    const result = {
      name: this.name,
    };

    this.callPlugins("process", this);

    this.callPlugins("build", result);

    return result;
  }
}

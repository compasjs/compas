const _plugins = [];

class App {
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
     */
    this.store = {};
  }

  static withPlugin(plugin) {
    _plugins.push(plugin);
  }

  build() {
    const result = {
      name: this.name,
    };
    for (const plugin of _plugins) {
      plugin(result, this.store);
    }

    return result;
  }
}

module.exports = {
  App,
};

const { processRoutes } = require("./routes");
const { RouteBuilder } = require("./RouteBuilder");
const { processValidators } = require("./validators");
const { ValidatorBuilder } = require("./ValidatorBuilder");

const V = new ValidatorBuilder();

class FluentApp {
  constructor() {
    /**
     * @private
     */
    this.validators = {};

    /**
     * @private
     */
    this.routeBuilders = [];

    /**
     * @private
     */
    this.lastAddedItem = undefined;

    /**
     * @public
     * @type {ValidatorBuilder}
     */
    this.V = V;
  }

  /**
   * @public
   * @param {string} name
   * @param {AbstractValidatorBuilder} v
   * @return {FluentApp}
   */
  validator(name, v) {
    this.validators[name] = v.build();

    this.lastAddedItem = this.validators[name];

    return this;
  }

  /**
   * @public
   * @param {string} name
   * @return {RouteBuilder}
   */
  get(name) {
    return this.route("GET", name);
  }

  /**
   * @public
   * @param {string} name
   * @return {RouteBuilder}
   */
  post(name) {
    return this.route("POST", name);
  }

  /**
   * @public
   * @param {string} name
   * @return {RouteBuilder}
   */
  put(name) {
    return this.route("PUT", name);
  }

  /**
   * @public
   * @param {string} name
   * @return {RouteBuilder}
   */
  del(name) {
    return this.route("DELETE", name);
  }

  /**
   * @public
   * @param {string} name
   * @return {RouteBuilder}
   */
  head(name) {
    return this.route("HEAD", name);
  }

  /**
   * @private
   * @return {RouteBuilder}
   */
  route(method, name) {
    const r = new RouteBuilder(this, name, method);
    this.routeBuilders.push(r);

    return r;
  }

  callback() {
    this.lastAddedItem = undefined;

    const validators = processValidators(this.validators);
    const { routes, routeTrie } = processRoutes(
      this.routeBuilders.map(it => it.build()),
    );
    return () => ({
      validators,
      routes,
      routeTrie,
    });
  }
}

module.exports = {
  FluentApp,
  V,
};

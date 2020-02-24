const utils = require("./utils");
const { merge } = require("@lbu/stdlib");

class RouteBuilder {
  constructor(fluentApp, name, method) {
    this.fluentApp = fluentApp;
    this.item = {
      name,
      method,
      path: "",
      tags: [],
      docs: "",
      queryValidator: undefined,
      paramsValidator: undefined,
      bodyValidator: undefined,
    };
  }

  /**
   * @public
   * @param {string} value
   * @return {RouteBuilder}
   */
  path(value) {
    this.item.path = value;
    return this;
  }

  /**
   * @public
   * @param {string|AbstractValidatorBuilder} validator
   * @return {RouteBuilder}
   */
  query(validator) {
    if (typeof validator === "string") {
      const typeName = utils.upperCaseFirst(validator);

      this.item.queryValidator = {
        typeName,
        funcName: `validate${typeName}`,
      };

      return this;
    } else if ("build" in validator) {
      const typeName = `QuerySchema${utils.upperCaseFirst(this.item.name)}`;
      this.fluentApp.validator(typeName, validator);

      this.item.queryValidator = {
        typeName,
        funcName: `validate${typeName}`,
      };

      return this;
    } else {
      throw new Error("Expecting either string or ValidatorBuilder");
    }
  }

  /**
   * @public
   * @param {string|AbstractValidatorBuilder} validator
   * @return {RouteBuilder}
   */
  body(validator) {
    if (typeof validator === "string") {
      const typeName = utils.upperCaseFirst(validator);

      this.item.bodyValidator = {
        typeName,
        funcName: `validate${typeName}`,
      };

      return this;
    } else if ("build" in validator) {
      const typeName = `BodySchema${utils.upperCaseFirst(this.item.name)}`;
      this.fluentApp.validator(typeName, validator);

      this.item.bodyValidator = {
        typeName,
        funcName: `validate${typeName}`,
      };

      return this;
    } else {
      throw new Error("Expecting either string or ValidatorBuilder");
    }
  }

  /**
   * @public
   * @param {string|AbstractValidatorBuilder} validator
   * @return {RouteBuilder}
   */
  params(validator) {
    if (typeof validator === "string") {
      const typeName = utils.upperCaseFirst(validator);

      this.item.paramsValidator = {
        typeName,
        funcName: `validate${typeName}`,
      };

      return this;
    } else if ("build" in validator) {
      const typeName = `ParamsSchema${utils.upperCaseFirst(this.item.name)}`;
      this.fluentApp.validator(typeName, validator);

      this.item.paramsValidator = {
        typeName,
        funcName: `validate${typeName}`,
      };

      return this;
    } else {
      throw new Error("Expecting either string or ValidatorBuilder");
    }
  }

  /**
   * @public
   * @param {...string} values
   * @return {RouteBuilder}
   */
  tags(...values) {
    this.item.tags = values;
    return this;
  }

  /**
   * @public
   * @param {string} docValue
   * @return {RouteBuilder}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  build() {
    return merge({}, this.item);
  }
}

module.exports = {
  RouteBuilder,
};

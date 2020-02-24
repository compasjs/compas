const { isNil, merge } = require("@lbu/stdlib");

/**
 * @callback ValidatorCallback
 * @param {ValidatorBuilder} V
 * @return {AbstractValidatorBuilder}
 */

/**
 * Internal delegate for providing a fluent validator building experience
 */
class AbstractValidatorBuilder {
  /**
   * @public
   */
  build() {
    throw new Error("Not implemented");
  }
}

class ValidatorBuilder {
  constructor() {}

  bool() {
    return new BooleanBuilder();
  }

  boolean() {
    return this.bool();
  }

  number() {
    return new NumberBuilder();
  }

  string() {
    return new StringBuilder();
  }

  /**
   * @param {Object<string, AbstractValidatorBuilder>} [obj]
   * @return {ObjectBuilder}
   */
  object(obj) {
    return new ObjectBuilder(obj);
  }

  /**
   * @param {AbstractValidatorBuilder} [value]
   * @return {ArrayBuilder}
   */
  array(value) {
    return new ArrayBuilder(value);
  }

  /**
   * @param {...AbstractValidatorBuilder} items
   * @return {AnyOfBuilder}
   */
  anyOf(...items) {
    return new AnyOfBuilder(...items);
  }

  /**
   * @param {string} [type]
   * @return {ReferenceBuilder}
   */
  ref(type) {
    return this.reference(type);
  }

  /**
   * @param {string} [type]
   * @return {ReferenceBuilder}
   */
  reference(type) {
    return new ReferenceBuilder(type);
  }
}

class BooleanBuilder extends AbstractValidatorBuilder {
  constructor() {
    super();

    this.item = {
      type: "boolean",
      docs: "",
      optional: false,
      convert: false,
      oneOf: undefined,
    };
  }

  /**
   * @public
   * @param {string} docValue
   * @return {BooleanBuilder}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {BooleanBuilder}
   */
  optional() {
    this.item.optional = true;
    return this;
  }

  /**
   * @public
   * @return {BooleanBuilder}
   */
  convert() {
    this.item.convert = true;
    return this;
  }

  /**
   * @public
   * @param {boolean} value
   * @return {BooleanBuilder}
   */
  oneOf(value) {
    this.item.oneOf = value;
    return this;
  }

  build() {
    return merge({}, this.item);
  }
}

class NumberBuilder extends AbstractValidatorBuilder {
  constructor() {
    super();

    this.item = {
      type: "number",
      docs: "",
      optional: false,
      convert: false,
      oneOf: undefined,
      min: undefined,
      max: undefined,
      integer: false,
    };
  }

  /**
   * @public
   * @param {string} docValue
   * @return {NumberBuilder}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {NumberBuilder}
   */
  optional() {
    this.item.optional = true;
    return this;
  }

  /**
   * @public
   * @return {NumberBuilder}
   */
  convert() {
    this.item.convert = true;
    return this;
  }

  /**
   * @public
   * @param {...number} values
   * @return {NumberBuilder}
   */
  oneOf(...values) {
    this.item.oneOf = values;
    return this;
  }

  /**
   * @public
   * @return {NumberBuilder}
   */
  integer() {
    this.item.integer = true;
    return this;
  }

  /**
   * @public
   * @param {number} value
   * @return {NumberBuilder}
   */
  min(value) {
    this.item.min = value;
    return this;
  }

  /**
   * @public
   * @param {number} value
   * @return {NumberBuilder}
   */
  max(value) {
    this.item.max = value;
    return this;
  }

  build() {
    return merge({}, this.item);
  }
}

class StringBuilder extends AbstractValidatorBuilder {
  constructor() {
    super();

    this.item = {
      type: "string",
      docs: "",
      optional: false,
      convert: false,
      oneOf: undefined,
      trim: false,
      lowerCase: false,
      upperCase: false,
      pattern: undefined,
    };
  }

  /**
   * @public
   * @param {string} docValue
   * @return {StringBuilder}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {StringBuilder}
   */
  optional() {
    this.item.optional = true;
    return this;
  }

  /**
   * @public
   * @return {StringBuilder}
   */
  convert() {
    this.item.convert = true;
    return this;
  }

  /**
   * @public
   * @return {StringBuilder}
   */
  trim() {
    this.item.trim = true;
    return this;
  }

  /**
   * @public
   * @return {StringBuilder}
   */
  lowerCase() {
    this.item.lowerCase = true;
    return this;
  }

  /**
   * @public
   * @return {StringBuilder}
   */
  upperCase() {
    this.item.upperCase = true;
    return this;
  }

  /**
   * @public
   * @param {...string} values
   * @return {StringBuilder}
   */
  oneOf(...values) {
    this.item.oneOf = values;
    return this;
  }

  /**
   * @public
   * @param {RegExp} value
   * @return {StringBuilder}
   */
  pattern(value) {
    this.item.pattern = value;
    return this;
  }

  build() {
    return merge({}, this.item);
  }
}

class ObjectBuilder extends AbstractValidatorBuilder {
  /**
   * @param {Object<string, AbstractValidatorBuilder>} [obj]
   */
  constructor(obj) {
    super();

    this.item = {
      type: "object",
      docs: "",
      optional: false,
      strict: false,
      keys: {},
    };

    if (!isNil(obj)) {
      this.keys(obj);
    }
  }

  /**
   * @public
   * @param {string} docValue
   * @return {ObjectBuilder}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {ObjectBuilder}
   */
  optional() {
    this.item.optional = true;
    return this;
  }

  /**
   * @public
   * @return {ObjectBuilder}
   */
  strict() {
    this.item.strict = true;
    return this;
  }

  /**
   * @public
   * @param {Object<string, AbstractValidatorBuilder>} obj
   * @return {ObjectBuilder}
   */
  keys(obj) {
    for (const key of Object.keys(obj)) {
      this.item.keys[key] = obj[key].build();
    }
    return this;
  }

  build() {
    return merge({}, this.item);
  }
}

class ArrayBuilder extends AbstractValidatorBuilder {
  /**
   * @param {AbstractValidatorBuilder} [value]
   */
  constructor(value) {
    super();

    this.item = {
      type: "array",
      docs: "",
      optional: false,
      convert: false,
      min: undefined,
      max: undefined,
      values: undefined,
    };

    if (!isNil(value)) {
      this.values(value);
    }
  }

  /**
   * @public
   * @param {string} docValue
   * @return {ArrayBuilder}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {ArrayBuilder}
   */
  optional() {
    this.item.optional = true;
    return this;
  }

  /**
   * @public
   * @return {ArrayBuilder}
   */
  convert() {
    this.item.convert = true;
    return this;
  }

  /**
   * @public
   * @param {number} value
   * @return {ArrayBuilder}
   */
  min(value) {
    this.item.min = value;
    return this;
  }

  /**
   * @public
   * @param {number} value
   * @return {ArrayBuilder}
   */
  max(value) {
    this.item.max = value;
    return this;
  }

  /**
   * @public
   * @param {AbstractValidatorBuilder} value
   * @return {ArrayBuilder}
   */
  values(value) {
    this.item.values = value.build();
    return this;
  }

  build() {
    return merge({}, this.item);
  }
}

class AnyOfBuilder extends AbstractValidatorBuilder {
  /**
   * @param {...AbstractValidatorBuilder} items
   */
  constructor(...items) {
    super();
    this.item = {
      type: "anyOf",
      docs: "",
      optional: false,
      values: [],
    };

    this.values(...items);
  }

  /**
   * @public
   * @param {string} docValue
   * @return {AnyOfBuilder}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {AnyOfBuilder}
   */
  optional() {
    this.item.optional = true;
    return this;
  }

  /**
   * @public
   * @param {...AbstractValidatorBuilder} items
   * @return {AnyOfBuilder}
   */
  values(...items) {
    for (const it of items) {
      this.item.values.push(it.build());
    }
    return this;
  }

  build() {
    return merge({}, this.item);
  }
}

class ReferenceBuilder extends AbstractValidatorBuilder {
  /**
   * @param {string} [type]
   */
  constructor(type) {
    super();
    this.item = {
      type: "reference",
      docs: "",
      optional: false,
      referenceType: type,
    };
  }

  /**
   * @public
   * @param {string} docValue
   * @return {ReferenceBuilder}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {ReferenceBuilder}
   */
  optional() {
    this.item.optional = true;
    return this;
  }

  /**
   * @public
   * @param {string} value
   * @return {ReferenceBuilder}
   */
  type(value) {
    this.item.referenceType = value;
    return this;
  }

  build() {
    return merge({}, this.item);
  }
}

module.exports = {
  ValidatorBuilder,
};

import { isNil, isPlainObject, merge } from "@lbu/stdlib";

/**
 * Internal delegate for providing a fluent model building experience
 */
class ModelBuilder {
  constructor() {
    this.item = {
      type: undefined,
      name: undefined,
      docs: undefined,
      optional: false,
      default: undefined,
    };
  }

  /**
   * @public
   * @param {string} name
   * @return {this}
   */
  name(name) {
    this.item.name = name;
    return this;
  }

  /**
   * @public
   * @param {string} docs
   * @return {this}
   */
  docs(docs) {
    this.item.docs = docs;
    return this;
  }

  /**
   * @public
   * @return {this}
   */
  optional() {
    this.item.optional = true;
    return this;
  }

  /**
   * @public
   * @param {string|boolean|number} value
   * @return {this}
   */
  default(value) {
    this.item.default = value;
    this.item.optional = !isNil(value);
    return this;
  }

  /**
   * @public
   */
  build() {
    if (this.item === undefined) {
      throw new Error("Not implemented");
    }
    return merge({}, this.item);
  }
}

class LbuBool extends ModelBuilder {
  constructor() {
    super();

    this.item.type = "boolean";
    this.item.oneOf = undefined;
  }

  /**
   * @public
   * @param {boolean} value
   * @return {LbuBool}
   */
  oneOf(value) {
    this.item.oneOf = value;
    return this;
  }
}

class LbuNumber extends ModelBuilder {
  constructor() {
    super();

    this.item.type = "number";
    this.item.oneOf = undefined;
  }

  /**
   * @public
   * @param {...number} values
   * @return {LbuNumber}
   */
  oneOf(...values) {
    this.item.oneOf = values;
    return this;
  }
}

class LbuString extends ModelBuilder {
  constructor() {
    super();
    this.item.type = "string";
    this.item.oneOf = undefined;
  }

  /**
   * @public
   * @param {...string} values
   * @return {LbuString}
   */
  oneOf(...values) {
    this.item.oneOf = values;
    return this;
  }
}

class LbuObject extends ModelBuilder {
  /**
   * @param {Object<string, ModelBuilder>} [obj]
   */
  constructor(obj) {
    super();
    this.item.type = "object";
    this.item.keys = {};

    if (!isNil(obj)) {
      this.keys(obj);
    }
  }

  /**
   * @public
   * @param {Object<string, ModelBuilder>} obj
   * @return {LbuObject}
   */
  keys(obj) {
    this.item.keys = merge(this.item.keys, obj);
    return this;
  }

  /**
   * @public
   * @param {string} [name]
   * @return {LbuObject}
   */
  copy(name) {
    const result = new LbuObject();
    result.item = merge({}, this.item, { name });

    return result;
  }

  build() {
    const keys = this.item.keys;
    this.item.keys = {};
    const result = super.build();

    for (const key of Object.keys(keys)) {
      result.keys[key] = keys[key].build();
    }

    this.item.keys = keys;

    return result;
  }
}

class LbuArray extends ModelBuilder {
  /**
   * @param {ModelBuilder} [value]
   */
  constructor(value) {
    super();

    this.item.type = "array";
    this.item.values = undefined;

    if (!isNil(value)) {
      this.values(value);
    }
  }

  /**
   * @public
   * @param {ModelBuilder} [value]
   * @return {LbuArray}
   */
  values(value) {
    this.item.values = value;
    return this;
  }

  /**
   * @public
   * @param {string} [name]
   * @return {LbuArray}
   */
  copy(name) {
    const result = new LbuArray();
    result.item = merge({}, this.item, { name });

    return result;
  }

  build() {
    const values = this.item.values;
    this.item.values = undefined;
    const result = super.build();

    result.values = values.build();

    this.item.values = values;

    return result;
  }
}

class LbuAnyOf extends ModelBuilder {
  /**
   * @param {...ModelBuilder} [items]
   */
  constructor(...items) {
    super();

    this.item.type = "anyOf";
    this.item.values = undefined;

    if (items.length !== 0) {
      this.values(...items);
    }
  }

  /**
   * @public
   * @param {...ModelBuilder} [items]
   * @return {LbuAnyOf}
   */
  values(...items) {
    if (isNil(this.item.values)) {
      this.item.values = [];
    }

    this.item.values.push(...items);

    return this;
  }

  /**
   * @public
   * @param {string} [name]
   * @return {LbuAnyOf}
   */
  copy(name) {
    const result = new LbuAnyOf();
    result.item = merge({}, this.item, { name });

    return result;
  }

  build() {
    const values = this.item.values;
    this.item.values = [];
    const result = super.build();

    for (const value of values) {
      result.values.push(value.build());
    }

    this.item.values = values;

    return result;
  }
}

class LbuRef extends ModelBuilder {
  /**
   * @param {string} [type]
   * @param {string} [field]
   */
  constructor(type, field) {
    super();

    this.item.type = "reference";
    this.item.referenceModel = undefined;
    this.item.referenceField = undefined;

    this.type(type);

    if (!isNil(field)) {
      this.externalField(field);
    }
  }

  /**
   * @public
   * @param {string} type
   * @return {LbuRef}
   */
  type(type) {
    this.item.referenceModel = type;
    return this;
  }

  /**
   * @public
   * @param {string} field
   * @return {LbuRef}
   */
  externalField(field) {
    this.item.referenceField = field;
    return this;
  }
}

class LbuAny extends ModelBuilder {
  constructor() {
    super();

    this.item.type = "any";
    this.item.typeOf = undefined;
    this.item.instanceOf = undefined;
  }

  /**
   * @public
   * @param {string} value
   * @return {LbuAny}
   */
  typeOf(value) {
    this.item.typeOf = value;
    return this;
  }

  /**
   * @public
   * @param {string} value
   * @return {LbuAny}
   */
  instanceOf(value) {
    this.item.instanceOf = value;
    return this;
  }
}

class LbuGeneric extends ModelBuilder {
  /**
   * @param {ModelBuilder} [value]
   */
  constructor(value) {
    super();

    this.item.type = "generic";
    this.item.keys = undefined;
    this.item.values = undefined;

    if (!isNil(value)) {
      this.values(value);
    }
  }

  /**
   * @public
   * @param {ModelBuilder} [key]
   * @return {LbuGeneric}
   */
  keys(key) {
    this.item.keys = key;
    return this;
  }

  /**
   * @public
   * @param {ModelBuilder} [value]
   * @return {LbuGeneric}
   */
  values(value) {
    this.item.values = value;
    return this;
  }

  /**
   * @public
   * @param {string} [name]
   * @return {LbuGeneric}
   */
  copy(name) {
    const result = new LbuGeneric();
    result.item = merge({}, this.item, { name });

    return result;
  }

  build() {
    const keys = this.item.keys;
    const values = this.item.values;

    this.item.keys = undefined;
    this.item.values = undefined;

    const result = super.build();
    result.keys = keys.build();
    result.values = values.build();

    this.item.keys = keys;
    this.item.values = values;

    return result;
  }
}

class ModelIntantiator {
  /**
   * Check if value is instanceof ModelBuilder
   * @param {*} value
   * @return {boolean}
   */
  instanceOf(value) {
    return value instanceof ModelBuilder;
  }

  /**
   * @public
   * @param {string} [name]
   * @return {LbuBool}
   */
  bool(name) {
    return new LbuBool().name(name);
  }

  /**
   * @public
   * @param {string} [name]
   * @return {LbuNumber}
   */
  number(name) {
    return new LbuNumber().name(name);
  }

  /**
   * @public
   * @param {string} [name]
   * @return {LbuString}
   */
  string(name) {
    return new LbuString().name(name);
  }

  /**
   * @public
   * @param {string|Object<string, ModelBuilder>} [name]
   * @param {Object<string, ModelBuilder>} [obj]
   * @return {LbuObject}
   */
  object(name, obj) {
    if (isPlainObject(name)) {
      return new LbuObject(name);
    } else {
      return new LbuObject(obj).name(name);
    }
  }

  /**
   * @public
   * @param {string|ModelBuilder} [name]
   * @param {ModelBuilder} [value]
   * @return {LbuArray}
   */
  array(name, value) {
    if (this.instanceOf(name)) {
      return new LbuArray(name);
    } else {
      return new LbuArray(value).name(name);
    }
  }

  /**
   * @public
   * @param {string|ModelBuilder[]} [name]
   * @param {...ModelBuilder} [values]
   * @return {LbuAnyOf}
   */
  anyOf(name, ...values) {
    if (Array.isArray(name)) {
      return new LbuAnyOf(...name);
    } else {
      return new LbuAnyOf(...values).name(name);
    }
  }

  /**
   * @public
   * @param {string} [type]
   * @param {string} [field]
   * @return {LbuRef}
   */
  ref(type, field) {
    return new LbuRef(type, field);
  }

  /**
   * @public
   * @param {string} [name]
   * @return {LbuAny}
   */
  any(name) {
    return new LbuAny().name(name);
  }

  /**
   * @public
   * @param {string} [name]
   * @return {LbuGeneric}
   */
  generic(name) {
    return new LbuGeneric().name(name);
  }
}

export const M = new ModelIntantiator();

M.types = {
  LbuBool,
  LbuNumber,
  LbuString,
  LbuObject,
  LbuArray,
  LbuAnyOf,
  LbuRef,
  LbuAny,
  LbuGeneric,
};

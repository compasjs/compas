import { isNil, merge } from "@lbu/stdlib";

export function M(name) {
  return {
    /**
     * @return {LbuBool}
     */
    bool: () => M.bool().name(name),
    /**
     * @return {LbuBool}
     */ boolean: () => M.boolean().name(name),
    /**
     * @return {LbuNumber}
     */ number: () => M.number().name(name),
    /**
     * @return {LbuString}
     */ string: () => M.string().name(name),
    /**
     * @param {Object<string, ModelBuilder>} [obj]
     * @return {LbuObject}
     */ object: obj => M.object(obj).name(name),
    /**
     * @param {ModelBuilder} [value]
     * @return {LbuArray}
     */ array: value => M.array(value).name(name),
    /**
     * @param {...ModelBuilder} [items]
     * @return {LbuAnyOf}
     */ anyOf: (...items) => M.anyOf(...items).name(name),

    /**
     * @return {LbuAny}
     */
    any: () => M.any().name(name),
    /**
     *
     * @return {LbuGeneric}
     */ generic: () => M.generic().name(name),
  };
}

M.bool = () => new LbuBool();
M.boolean = () => new LbuBool();
M.number = () => new LbuNumber();
M.string = () => new LbuString();

/**
 * @param {Object<string, ModelBuilder>} [obj]
 */
M.object = obj => new LbuObject(obj);

/**
 * @param {ModelBuilder} [value]
 */
M.array = value => new LbuArray(value);

/**
 * @param {...ModelBuilder} [items]
 */
M.anyOf = (...items) => new LbuAnyOf(...items);

/**
 * @param {string} [type]
 * @param {string} [field]
 */
M.ref = (type, field) => new LbuRef(type, field);

M.any = () => new LbuAny();
M.generic = () => new LbuGeneric();

/**
 * Internal delegate for providing a fluent model building experience
 */
class ModelBuilder {
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

    this.item = {
      type: "boolean",
      name: undefined,
      docs: undefined,
      optional: false,
      default: undefined,
      oneOf: undefined,
    };
  }

  /**
   * @public
   * @param {string} name
   * @return {LbuBool}
   */
  name(name) {
    this.item.name = name;
    return this;
  }

  /**
   * @public
   * @param {string} docValue
   * @return {LbuBool}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @param {boolean|string} value Value is inline printed
   * @return {LbuBool}
   */
  default(value) {
    this.item.default = value;
    this.item.optional = true;

    return this;
  }

  /**
   * @public
   * @return {LbuBool}
   */
  optional() {
    this.item.optional = true;
    return this;
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

    this.item = {
      type: "number",
      name: undefined,
      docs: undefined,
      optional: false,
      default: undefined,
      oneOf: undefined,
    };
  }

  /**
   * @public
   * @param {string} name
   * @return {LbuNumber}
   */
  name(name) {
    this.item.name = name;
    return this;
  }

  /**
   * @public
   * @param {string} docValue
   * @return {LbuNumber}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @param {number|string} value Value is inline printed
   * @return {LbuNumber}
   */
  default(value) {
    this.item.default = value;
    this.item.optional = true;

    return this;
  }

  /**
   * @public
   * @return {LbuNumber}
   */
  optional() {
    this.item.optional = true;
    return this;
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

    this.item = {
      type: "string",
      name: undefined,
      docs: undefined,
      optional: false,
      default: undefined,
      oneOf: undefined,
    };
  }

  /**
   * @public
   * @param {string} name
   * @return {LbuString}
   */
  name(name) {
    this.item.name = name;
    return this;
  }

  /**
   * @public
   * @param {string} docValue
   * @return {LbuString}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @param {string} value Value is inline printed
   * @return {LbuString}
   */
  default(value) {
    this.item.default = value;
    this.item.optional = true;

    return this;
  }

  /**
   * @public
   * @return {LbuString}
   */
  optional() {
    this.item.optional = true;
    return this;
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

    this.item = {
      type: "object",
      name: undefined,
      docs: undefined,
      optional: false,
      keys: {},
    };

    if (!isNil(obj)) {
      this.keys(obj);
    }
  }

  /**
   * @public
   * @param {string} name
   * @return {LbuObject}
   */
  name(name) {
    this.item.name = name;
    return this;
  }

  /**
   * @public
   * @param {string} docValue
   * @return {LbuObject}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {LbuObject}
   */
  optional() {
    this.item.optional = true;
    return this;
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

    this.item = {
      type: "array",
      name: undefined,
      docs: undefined,
      optional: false,
      values: undefined,
    };

    if (!isNil(value)) {
      this.values(value);
    }
  }

  /**
   * @public
   * @param {string} name
   * @return {LbuArray}
   */
  name(name) {
    this.item.name = name;
    return this;
  }

  /**
   * @public
   * @param {string} docValue
   * @return {LbuArray}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {LbuArray}
   */
  optional() {
    this.item.optional = true;
    return this;
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

    this.item = {
      type: "anyOf",
      name: undefined,
      docs: undefined,
      optional: false,
      values: undefined,
    };

    if (items.length !== 0) {
      this.values(...items);
    }
  }

  /**
   * @public
   * @param {string} name
   * @return {LbuAnyOf}
   */
  name(name) {
    this.item.name = name;
    return this;
  }

  /**
   * @public
   * @param {string} docValue
   * @return {LbuAnyOf}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {LbuAnyOf}
   */
  optional() {
    this.item.optional = true;
    return this;
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

    this.item = {
      type: "reference",
      name: undefined,
      docs: undefined,
      optional: false,
      referenceModel: undefined,
      referenceField: undefined,
    };

    this.type(type);

    if (!isNil(field)) {
      this.externalField(field);
    }
  }

  /**
   * @public
   * @param {string} name
   * @return {LbuRef}
   */
  name(name) {
    this.item.name = name;
    return this;
  }

  /**
   * @public
   * @param {string} docValue
   * @return {LbuRef}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {LbuRef}
   */
  optional() {
    this.item.optional = true;
    return this;
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

    this.item = {
      type: "any",
      name: undefined,
      docs: undefined,
      optional: false,
      typeOf: undefined,
      instanceOf: undefined,
    };
  }

  /**
   * @public
   * @param {string} name
   * @return {LbuAny}
   */
  name(name) {
    this.item.name = name;
    return this;
  }

  /**
   * @public
   * @param {string} docValue
   * @return {LbuAny}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
  }

  /**
   * @public
   * @return {LbuAny}
   */
  optional() {
    this.item.optional = true;
    return this;
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

    this.item = {
      type: "generic",
      name: undefined,
      docs: undefined,
      keys: undefined,
      values: undefined,
    };

    if (!isNil(value)) {
      this.values(value);
    }
  }

  /**
   * @public
   * @param {string} name
   * @return {LbuGeneric}
   */
  name(name) {
    this.item.name = name;
    return this;
  }

  /**
   * @public
   * @param {string} docValue
   * @return {LbuGeneric}
   */
  docs(docValue) {
    this.item.docs = docValue;
    return this;
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

/**
 * Check if value is instanceof ModelBuilder
 * @param {*} value
 * @return {boolean}
 */
M.instanceOf = value => {
  return value instanceof ModelBuilder;
};

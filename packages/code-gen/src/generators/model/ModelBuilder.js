import { isNil, isPlainObject, merge } from "@lbu/stdlib";
import { TypeBuilder, TypeCreator } from "../../types/index.js";

class LbuBool extends TypeBuilder {
  constructor(group, name) {
    super("boolean", group, name);

    this.data.oneOf = undefined;
  }

  /**
   * @public
   * @param {boolean} value
   * @return {LbuBool}
   */
  oneOf(value) {
    this.data.oneOf = value;
    return this;
  }
}

class LbuNumber extends TypeBuilder {
  constructor(group, name) {
    super("number", group, name);

    this.data.oneOf = undefined;
  }

  /**
   * @public
   * @param {...number} values
   * @return {LbuNumber}
   */
  oneOf(...values) {
    this.data.oneOf = values;
    return this;
  }
}

class LbuString extends TypeBuilder {
  constructor(group, name) {
    super("string", group, name);

    this.data.oneOf = undefined;
  }

  /**
   * @public
   * @param {...string} values
   * @return {LbuString}
   */
  oneOf(...values) {
    this.data.oneOf = values;
    return this;
  }
}

class LbuObject extends TypeBuilder {
  constructor(group, name, obj) {
    super("object", group, name);

    this.internalKeys = {};

    if (!isNil(obj)) {
      this.keys(obj);
    }
  }

  /**
   * @public
   * @param {Object<string, TypeBuilder>} obj
   * @return {LbuObject}
   */
  keys(obj) {
    this.internalKeys = merge(this.internalKeys, obj);
    return this;
  }

  build() {
    const result = super.build();

    result.keys = {};

    for (const k of Object.keys(this.internalKeys)) {
      result.keys[k] = this.internalKeys[k].build();
    }

    return result;
  }
}

class LbuArray extends TypeBuilder {
  constructor(group, name, value) {
    super("array", group, name);

    this.internalValues = undefined;

    if (!isNil(value)) {
      this.values(value);
    }
  }

  /**
   * @public
   * @param {TypeBuilder} [value]
   * @return {LbuArray}
   */
  values(value) {
    this.internalValues = value;
    return this;
  }

  build() {
    const result = super.build();

    result.values = this.internalValues.build();

    return result;
  }
}

class LbuAnyOf extends TypeBuilder {
  constructor(group, name, items) {
    super("anyOf", group, name);

    this.internalValues = undefined;

    if (items.length !== 0) {
      this.values(...items);
    }
  }

  /**
   * @public
   * @param {...TypeBuilder} [items]
   * @return {LbuAnyOf}
   */
  values(...items) {
    if (isNil(this.internalValues)) {
      this.internalValues = [];
    }

    this.internalValues.push(...items);

    return this;
  }

  build() {
    const result = super.build();

    result.values = [];
    for (const v of this.internalValues) {
      result.values.push(v.build());
    }

    return result;
  }
}

class LbuRef extends TypeBuilder {
  constructor(group, name, type, field) {
    super("reference", group, name);

    this.data.referenceModel = undefined;
    this.data.referenceField = undefined;

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
    this.data.referenceModel = type;
    return this;
  }

  /**
   * @public
   * @param {string} field
   * @return {LbuRef}
   */
  externalField(field) {
    this.data.referenceField = field;
    return this;
  }
}

class LbuAny extends TypeBuilder {
  constructor(group, name) {
    super("any", group, name);

    this.data.typeOf = undefined;
    this.data.instanceOf = undefined;
  }

  /**
   * @public
   * @param {string} value
   * @return {LbuAny}
   */
  typeOf(value) {
    this.data.typeOf = value;
    return this;
  }

  /**
   * @public
   * @param {string} value
   * @return {LbuAny}
   */
  instanceOf(value) {
    this.data.instanceOf = value;
    return this;
  }
}

class LbuGeneric extends TypeBuilder {
  constructor(group, name) {
    super("generic", group, name);

    this.internalKeys = undefined;
    this.internalValues = undefined;
  }

  /**
   * @public
   * @param {TypeBuilder} [key]
   * @return {LbuGeneric}
   */
  keys(key) {
    this.internalKeys = key;
    return this;
  }

  /**
   * @public
   * @param {TypeBuilder} [value]
   * @return {LbuGeneric}
   */
  values(value) {
    this.internalValues = value;
    return this;
  }

  build() {
    const result = super.build();

    result.keys = this.internalKeys.build();
    result.values = this.internalValues.build();

    return result;
  }
}

/**
 * @name TypeCreator#bool
 * @param {string} [name]
 * @return {LbuBool}
 */
TypeCreator.prototype.bool = function (name) {
  return new LbuBool(this.group, name);
};

/**
 * @name TypeCreator#number
 * @param {string} [name]
 * @return {LbuNumber}
 */
TypeCreator.prototype.number = function (name) {
  return new LbuNumber(this.group, name);
};

/**
 * @name TypeCreator#string
 * @param {string} [name]
 * @return {LbuString}
 */
TypeCreator.prototype.string = function (name) {
  return new LbuString(this.group, name);
};

/**
 * @name TypeCreator#object
 * @param {string|Object<string, TypeBuilder>} [name]
 * @param {Object<string, TypeBuilder>} [obj]
 * @return {LbuObject}
 */
TypeCreator.prototype.object = function (name, obj) {
  if (isPlainObject(name)) {
    return new LbuObject(this.group, undefined, name);
  } else {
    return new LbuObject(this.group, name, obj);
  }
};

/**
 * @name TypeCreator#array
 * @param {string|TypeBuilder} [name]
 * @param {TypeBuilder} [value]
 * @return {LbuArray}
 */
TypeCreator.prototype.array = function (name, value) {
  if (name instanceof TypeBuilder) {
    return new LbuArray(this.group, undefined, value);
  } else {
    return new LbuArray(this.group, name, value);
  }
};

/**
 * @name TypeCreator#anyOf
 * @param {string|TypeBuilder[]} [name]
 * @param {...TypeBuilder} [values]
 * @return {LbuAnyOf}
 */
TypeCreator.prototype.anyOf = function (name, ...values) {
  if (Array.isArray(name)) {
    return new LbuAnyOf(this.group, undefined, name);
  } else {
    return new LbuAnyOf(this.group, name, values);
  }
};

/**
 * @name TypeCreator#ref
 * @param {string} [type]
 * @param {string} [field]
 * @return {LbuRef}
 */
TypeCreator.prototype.ref = function (type, field) {
  return new LbuRef(this.group, undefined, type, field);
};

/**
 * @name TypeCreator#any
 * @param {string} [name]
 * @return {LbuAny}
 */
TypeCreator.prototype.any = function (name) {
  return new LbuAny(this.group, name);
};

/**
 * @name TypeCreator#generic
 * @param {string} [name]
 * @return {LbuGeneric}
 */
TypeCreator.prototype.generic = function (name) {
  return new LbuGeneric(this.group, name);
};

export const M = {
  types: {
    LbuBool,
    LbuNumber,
    LbuString,
    LbuObject,
    LbuArray,
    LbuAnyOf,
    LbuRef,
    LbuAny,
    LbuGeneric,
  },
};

import { merge } from "@lbu/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class ObjectType extends TypeBuilder {
  static baseData = {
    validator: {
      strict: true,
    },
  };

  build() {
    const result = super.build();

    result.keys = {};

    for (const k of Object.keys(this.internalKeys)) {
      result.keys[k] = buildOrInfer(this.internalKeys[k]);
    }

    return result;
  }

  constructor(group, name) {
    super("object", group, name);

    this.internalKeys = {};

    this.data = {
      ...this.data,
      ...ObjectType.getBaseData(),
    };
  }

  /**
   * @param {object<string, TypeBuilderLike>} obj
   * @returns {ObjectType}
   */
  keys(obj) {
    this.internalKeys = merge(this.internalKeys, obj);

    return this;
  }

  /**
   * @returns {ObjectType}
   */
  loose() {
    this.data.validator.strict = false;

    return this;
  }

  /**
   * @param {object} [options={}]
   * @param {boolean} [options.withSoftDeletes]
   * @param {boolean} [options.withDates]
   * @returns {ObjectType}
   */
  enableQueries(options = {}) {
    this.data.enableQueries = true;
    this.data.queryOptions = options;
    return this;
  }
}

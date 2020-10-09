import { isNil } from "@lbu/stdlib";
import { buildOrInfer, TypeBuilder, TypeCreator } from "../TypeBuilder.js";

class SearchableType extends TypeBuilder {
  static baseData = {};

  build() {
    if (isNil(this.builder)) {
      // Force an error
      this.value(undefined);
    }

    const buildResult = buildOrInfer(this.builder);

    if (isNil(this.data.name) && !isNil(buildResult.name)) {
      this.name(`${buildResult.name}Searchable`);
    }

    const thisResult = super.build();

    // Overwrite name, even if it may be undefined
    buildResult.uniqueName = thisResult.uniqueName;
    buildResult.group = thisResult.group;
    buildResult.name = thisResult.name;

    buildResult.sql = buildResult.sql || {};
    buildResult.sql.searchable = true;

    return buildResult;
  }

  constructor(group, name) {
    super(searchableType.name, group, name);

    this.data = {
      ...this.data,
      ...SearchableType.getBaseData(),
    };
  }

  /**
   * @param {TypeBuilderLike} builder
   * @returns {SearchableType}
   */
  value(builder) {
    if (isNil(builder)) {
      throw new TypeError(
        `T.searchable() expects a TypeBuilderLike as the first argument`,
      );
    }

    this.builder = builder;

    return this;
  }
}

const searchableType = {
  name: "searchable",
  class: SearchableType,
};

/**
 * @name TypeCreator#searchable
 * @param {string} [name]
 * @returns {SearchableType}
 */
TypeCreator.prototype.searchable = function (name) {
  return new SearchableType(this.group, name);
};

TypeCreator.types.set(searchableType.name, searchableType);

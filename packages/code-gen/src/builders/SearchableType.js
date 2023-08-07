import { isNil } from "@compas/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";
import { buildOrInfer } from "./utils.js";

export class SearchableType extends TypeBuilder {
  static baseData = {};

  build() {
    if (isNil(this.builder)) {
      // Force an error
      // @ts-expect-error
      this.value(undefined);
    }

    const buildResult = buildOrInfer(this.builder);

    if (isNil(this.data.name) && !isNil(buildResult.name)) {
      this.data.name = `${buildResult.name}Searchable`;
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
    super("searchable", group, name);

    this.data = {
      ...this.data,
      ...SearchableType.getBaseData(),
    };
  }

  /**
   * @param {import("../../types/advanced-types.d.ts").TypeBuilderLike} builder
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

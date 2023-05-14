import { AppError } from "@compas/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";

export class AnyType extends TypeBuilder {
  static baseData = {
    validator: {
      allowNull: false,
    },
  };

  constructor(group, name) {
    super("any", group, name);

    this.data = {
      ...this.data,
      ...AnyType.getBaseData(),
    };
  }

  /**
   * Add specific implementations for each supported target. Not all targets are
   * required. The targets are resolved based on the most specific target first (e.g.
   * 'jsAxios' before 'js').
   *
   * @param {import("../generated/common/types.js").StructureAnyDefinition["targets"]} targets
   * @returns {AnyType}
   */
  implementations(targets) {
    this.data.targets = targets;

    if (
      targets?.tsAxiosBrowser?.validatorExpression ||
      targets?.tsAxiosReactNative?.validatorExpression ||
      targets?.tsFetchBrowser?.validatorExpression ||
      targets?.tsFetchReactNative?.validatorExpression
    ) {
      throw AppError.serverError({
        message:
          "Can't have custom 'validatorExpression' for 'tsAxiosBrowser', 'tsAxiosReactNative', 'tsFetchBrowser' and 'tsFetchReactNative'.",
      });
    }

    return this;
  }
}

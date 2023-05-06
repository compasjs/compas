import { AppError } from "@compas/stdlib";
import { TypeBuilder } from "./TypeBuilder.js";

export class AnyType extends TypeBuilder {
  static baseData = {
    validator: {
      allowNull: false,
    },
    rawValue: undefined,
    rawValueImport: {
      javaScript: undefined,
      typeScript: undefined,
    },
    rawValidator: undefined,
    rawValidatorImport: {
      javaScript: undefined,
      typeScript: undefined,
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
   * Add raw type string instead of any.
   *
   * TODO(depr): add jsdoc tag
   *
   * @param {string} value
   * @param {{ javaScript?: string, typeScript?: string }} [importValue={}]
   * @returns {AnyType}
   */
  raw(value, importValue = {}) {
    this.data.rawValue = value.toString();
    this.data.rawValueImport = importValue;

    return this;
  }

  /**
   * Add raw validator instead of only undefined check.
   * This is validator is called with a value and should return a boolean.
   *
   * TODO(depr): add jsdoc tag
   *
   * @param {string} value
   * @param {{ javaScript?: string, typeScript?: string }} [importValue={}]
   * @returns {AnyType}
   */
  validator(value, importValue = {}) {
    this.data.rawValidator = value.toString();
    this.data.rawValidatorImport = importValue;

    return this;
  }

  /**
   * Add specific implementations for each supported target. Not all targets are
   * required. The targets are resolved based on the most specific target first (e.g.
   * 'jsAxios' before 'js').
   *
   * Note that these implementations are only used in @compas/code-gen/experimental.
   *
   * TODO: update above comment
   *
   * @param {import("../generated/common/types.js").ExperimentalAnyDefinition["targets"]} targets
   * @returns {AnyType}
   */
  implementations(targets) {
    this.data.targets = targets;

    if (
      targets?.tsAxiosBrowser?.validatorExpression ||
      targets?.tsAxiosReactNative?.validatorExpression
    ) {
      throw AppError.serverError({
        message:
          "Can't have custom 'validatorExpression' for 'tsAxiosBrowser' and 'tsAxiosReactNative'.",
      });
    }

    return this;
  }
}

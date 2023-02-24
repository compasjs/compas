export class AnyType extends TypeBuilder {
  static baseData: {
    validator: {
      allowNull: boolean;
    };
    rawValue: undefined;
    rawValueImport: {
      javaScript: undefined;
      typeScript: undefined;
    };
    rawValidator: undefined;
    rawValidatorImport: {
      javaScript: undefined;
      typeScript: undefined;
    };
  };
  constructor(group: any, name: any);
  /**
   * Add raw type string instead of any.
   *
   * TODO(depr): add jsdoc tag
   *
   * @param {string} value
   * @param {{ javaScript?: string, typeScript?: string }} [importValue={}]
   * @returns {AnyType}
   */
  raw(
    value: string,
    importValue?:
      | {
          javaScript?: string | undefined;
          typeScript?: string | undefined;
        }
      | undefined,
  ): AnyType;
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
  validator(
    value: string,
    importValue?:
      | {
          javaScript?: string | undefined;
          typeScript?: string | undefined;
        }
      | undefined,
  ): AnyType;
  /**
   * Add specific implementations for each supported target. Not all targets are
   * required. The targets are resolved based on the most specific target first (e.g.
   * 'jsAxios' before 'js').
   *
   * Note that these implementations are only used in @compas/code-gen/experimental.
   *
   * TODO: update above comment
   *
   * @param {import("../experimental/generated/common/types.js").ExperimentalAnyDefinition["targets"]} targets
   * @returns {AnyType}
   */
  implementations(
    targets: import("../experimental/generated/common/types.js").ExperimentalAnyDefinition["targets"],
  ): AnyType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=AnyType.d.ts.map

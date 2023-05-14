export class AnyType extends TypeBuilder {
  static baseData: {
    validator: {
      allowNull: boolean;
    };
  };
  constructor(group: any, name: any);
  /**
   * Add specific implementations for each supported target. Not all targets are
   * required. The targets are resolved based on the most specific target first (e.g.
   * 'jsAxios' before 'js').
   *
   * @param {import("../generated/common/types.js").StructureAnyDefinition["targets"]} targets
   * @returns {AnyType}
   */
  implementations(
    targets: import("../generated/common/types.js").StructureAnyDefinition["targets"],
  ): AnyType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=AnyType.d.ts.map

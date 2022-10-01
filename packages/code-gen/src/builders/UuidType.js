import { TypeBuilder } from "./TypeBuilder.js";

export class UuidType extends TypeBuilder {
  static baseData = {
    validator: {
      allowNull: false,
    },
  };

  constructor(group, name) {
    super("uuid", group, name);

    this.data = {
      ...this.data,
      ...UuidType.getBaseData(),
    };
  }
}

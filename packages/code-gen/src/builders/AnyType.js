import { TypeBuilder } from "./TypeBuilder.js";

export class AnyType extends TypeBuilder {
  static baseData = {};

  constructor(group, name) {
    super("any", group, name);

    this.data = {
      ...this.data,
      ...AnyType.getBaseData(),
    };
  }
}

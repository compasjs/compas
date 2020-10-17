import { TypeBuilder } from "./TypeBuilder.js";

export class FileType extends TypeBuilder {
  static baseData = {};

  constructor(group, name) {
    super("file", group, name);

    this.data = {
      ...this.data,
      ...FileType.getBaseData(),
    };
  }
}

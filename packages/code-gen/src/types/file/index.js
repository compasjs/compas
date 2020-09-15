import { TypeBuilder, TypeCreator } from "../TypeBuilder.js";

class FileType extends TypeBuilder {
  static baseData = {};

  constructor(group, name) {
    super(fileType.name, group, name);

    this.data = {
      ...this.data,
      ...FileType.getBaseData(),
    };
  }
}

const type = `
{{ if (it.isInputType && options.isBrowser) { }}
{ name?: string, data: Blob }
{{ } else if (it.isInputType && options.isNode) { }}
{ name?: string, data: ReadableStream }
{{ } else if (!it.isInputType && options.isBrowser) { }}
Blob
{{ } else { }}
{ size: number, path: string, name?: string, type?: string, lastModifiedDate?: Date, hash?: "sha1" | "md5" | "sha256" }
{{ } }}
`;
const fileType = {
  name: "file",
  class: FileType,
  jsType: () => type,
  tsType: () => type,
  validator: () => `
{{ /* Does nothing yet, but only allows to use optionals and defaults */ }}
return value;
`,
};

/**
 * @name TypeCreator#file
 * @param {string} [name]
 * @returns {FileType}
 */
TypeCreator.prototype.file = function (name) {
  return new FileType(this.group, name);
};

TypeCreator.types.set(fileType.name, fileType);

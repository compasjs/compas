import { TypeBuilder } from "./TypeBuilder.js";

export class FileType extends TypeBuilder {
  static baseData = {
    validator: {
      mimeTypes: undefined,
    },
  };

  constructor(group, name) {
    super("file", group, name);

    this.data = {
      ...this.data,
      ...FileType.getBaseData(),
    };
  }

  /**
   * Provide mimetypes which are statically checked based on what the client sends as the
   * mimetype.
   *
   * Common mimetypes for images, as supported by {@link sendTransformedImage}:
   * - image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif
   *
   * @param {...string} mimeTypes
   * @returns {FileType}
   */
  mimeTypes(...mimeTypes) {
    if (mimeTypes.length === 0) {
      throw new TypeError(
        `T.file().mimeTypes() should be called with at least a single value.`,
      );
    }

    this.data.validator.mimeTypes = mimeTypes;

    return this;
  }
}

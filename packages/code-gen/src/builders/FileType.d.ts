export class FileType extends TypeBuilder {
  static baseData: {
    validator: {
      mimeTypes: undefined;
    };
  };
  constructor(group: any, name: any);
  /**
   * Provide mimetypes which are statically checked based on what the client sends as the mimetype.
   *
   * Common mimetypes for images, as supported by {@link sendTransformedImage}:
   * - image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif
   *
   * @param {...string} mimeTypes
   * @returns {FileType}
   */
  mimeTypes(...mimeTypes: string[]): FileType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=FileType.d.ts.map

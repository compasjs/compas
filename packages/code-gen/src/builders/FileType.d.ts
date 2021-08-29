export class FileType extends TypeBuilder {
    static baseData: {
        validator: {
            mimeTypes: undefined;
        };
    };
    constructor(group: any, name: any);
    /**
     * @param {...string} mimeTypes
     * @returns {FileType}
     */
    mimeTypes(...mimeTypes: string[]): FileType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=FileType.d.ts.map
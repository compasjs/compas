export class ReferenceType extends TypeBuilder {
    static baseData: {
        reference: {
            group: undefined;
            name: undefined;
            uniqueName: undefined;
        };
    };
    /**
     * @param {string|TypeBuilder} group
     * @param {string} [name]
     */
    constructor(group: string | TypeBuilder, name?: string | undefined);
    ref: TypeBuilder | undefined;
    /**
     * @param {string|TypeBuilder} group
     * @param {string} [name]
     * @returns {ReferenceType}
     */
    set(group: string | TypeBuilder, name?: string | undefined): ReferenceType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=ReferenceType.d.ts.map
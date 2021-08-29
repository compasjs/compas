export class AnyType extends TypeBuilder {
    static baseData: {
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
     * @param {string} value
     * @param {{ javaScript?: string, typeScript?: string }} [importValue={}]
     * @returns {AnyType}
     */
    raw(value: string, importValue?: {
        javaScript?: string | undefined;
        typeScript?: string | undefined;
    } | undefined): AnyType;
    /**
     * Add raw validator instead of only undefined check.
     * This is validator is called with a value and should return a boolean.
     *
     * @param {string} value
     * @param {{ javaScript?: string, typeScript?: string }} [importValue={}]
     * @returns {AnyType}
     */
    validator(value: string, importValue?: {
        javaScript?: string | undefined;
        typeScript?: string | undefined;
    } | undefined): AnyType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=AnyType.d.ts.map
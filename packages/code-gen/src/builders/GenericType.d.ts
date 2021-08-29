/**
 * @typedef {import("../../types/advanced-types").TypeBuilderLike} TypeBuilderLike
 */
export class GenericType extends TypeBuilder {
    static baseData: {};
    constructor(group: any, name: any);
    internalKeys: any;
    internalValues: any;
    /**
     * @param {TypeBuilderLike} [key]
     * @returns {GenericType}
     */
    keys(key?: any): GenericType;
    /**
     * @param {TypeBuilderLike} [value]
     * @returns {GenericType}
     */
    values(value?: any): GenericType;
}
export type TypeBuilderLike = import("../../types/advanced-types").TypeBuilderLike;
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=GenericType.d.ts.map
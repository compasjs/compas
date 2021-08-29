/**
 * @typedef {import("../../types/advanced-types").TypeBuilderLike} TypeBuilderLike
 */
export class ArrayType extends TypeBuilder {
    static baseData: {
        validator: {
            convert: boolean;
            min: undefined;
            max: undefined;
        };
    };
    constructor(group: any, name: any);
    internalValues: any;
    /**
     * @param {TypeBuilderLike} [value]
     * @returns {ArrayType}
     */
    values(value?: any): ArrayType;
    /**
     * @returns {ArrayType}
     */
    convert(): ArrayType;
    /**
     * @param {number} min
     * @returns {ArrayType}
     */
    min(min: number): ArrayType;
    /**
     * @param {number} max
     * @returns {ArrayType}
     */
    max(max: number): ArrayType;
}
export type TypeBuilderLike = import("../../types/advanced-types").TypeBuilderLike;
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=ArrayType.d.ts.map
/**
 * @typedef {import("../../types/advanced-types").TypeBuilderLike} TypeBuilderLike
 */
export class OptionalType extends TypeBuilder {
    static baseData: {};
    constructor(group: any, name: any);
    /**
     * @param {TypeBuilderLike} builder
     * @returns {OptionalType}
     */
    value(builder: any): OptionalType;
    builder: any;
}
export type TypeBuilderLike = import("../../types/advanced-types").TypeBuilderLike;
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=OptionalType.d.ts.map
/**
 * @typedef {import("../../types/advanced-types").TypeBuilderLike} TypeBuilderLike
 */
export class OmitType extends TypeBuilder {
    static baseData: {
        keys: never[];
    };
    constructor(group: any, name: any);
    /**
     * @param {ObjectType|Record<string, TypeBuilderLike>} builder
     * @returns {OmitType}
     */
    object(builder: ObjectType | Record<string, TypeBuilderLike>): OmitType;
    builder: ObjectType | Record<string, any> | undefined;
    /**
     * @param {...string} keys
     * @returns {OmitType}
     */
    keys(...keys: string[]): OmitType;
}
export type TypeBuilderLike = import("../../types/advanced-types").TypeBuilderLike;
import { TypeBuilder } from "./TypeBuilder.js";
import { ObjectType } from "./ObjectType.js";
//# sourceMappingURL=OmitType.d.ts.map
/**
 * @typedef {import("../../types/advanced-types").TypeBuilderLike} TypeBuilderLike
 */
export class PickType extends TypeBuilder {
    static baseData: {
        keys: never[];
    };
    constructor(group: any, name: any);
    /**
     * @param {ObjectType|Record<string, TypeBuilderLike>} builder
     * @returns {PickType}
     */
    object(builder: ObjectType | Record<string, TypeBuilderLike>): PickType;
    builder: ObjectType | Record<string, any> | undefined;
    /**
     * @param {...string} keys
     * @returns {PickType}
     */
    keys(...keys: string[]): PickType;
}
export type TypeBuilderLike = import("../../types/advanced-types").TypeBuilderLike;
import { TypeBuilder } from "./TypeBuilder.js";
import { ObjectType } from "./ObjectType.js";
//# sourceMappingURL=PickType.d.ts.map
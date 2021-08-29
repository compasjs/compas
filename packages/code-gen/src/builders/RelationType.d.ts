export class RelationType {
    constructor(subType: any, ownKey: any, reference: any, referencedKey: any);
    data: {
        type: string;
        subType: any;
        ownKey: any;
        referencedKey: any;
    };
    reference: any;
    /**
     * @returns {RelationType}
     */
    optional(): RelationType;
    /**
     * @returns {Record<string, any>}
     */
    build(): Record<string, any>;
}
//# sourceMappingURL=RelationType.d.ts.map
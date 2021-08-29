export const PARALLEL_COUNT: number;
/**
 * @type {Object<string, {
 *    description: string,
 *    exec: (event: InsightEvent, verbose: boolean) => Promise<void>
 * }>}
 */
export const codeModMap: {
    [x: string]: {
        description: string;
        exec: (event: InsightEvent, verbose: boolean) => Promise<void>;
    };
};
//# sourceMappingURL=constants.d.ts.map
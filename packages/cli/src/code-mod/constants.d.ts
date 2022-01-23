export const PARALLEL_COUNT: number;
/**
 * @type {Record<string, {
 *    description: string,
 *    exec: (event: InsightEvent, verbose: boolean) => Promise<void>
 * }>}
 */
export const codeModMap: Record<
  string,
  {
    description: string;
    exec: (event: InsightEvent, verbose: boolean) => Promise<void>;
  }
>;
//# sourceMappingURL=constants.d.ts.map

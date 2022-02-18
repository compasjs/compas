export const PARALLEL_COUNT: number;
/**
 * @type {Record<string, {
 *    description: string,
 *    exec: (logger: Logger) => Promise<void>
 * }>}
 */
export const codeModMap: Record<
  string,
  {
    description: string;
    exec: (logger: Logger) => Promise<void>;
  }
>;
//# sourceMappingURL=constants.d.ts.map

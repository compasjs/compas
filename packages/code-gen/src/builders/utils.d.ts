/**
 * @param value
 * @returns {boolean}
 */
export function isNamedTypeBuilderLike(value: any): boolean;
/**
 * Either calls TypeBuilder#build or infers one of the following types:
 * - boolean oneOf
 * - number oneOf
 * - string oneOf
 * - array
 * - object
 *
 * @param {any} value
 * @returns {Record<string, any>}
 */
export function buildOrInfer(value: any): Record<string, any>;
//# sourceMappingURL=utils.d.ts.map

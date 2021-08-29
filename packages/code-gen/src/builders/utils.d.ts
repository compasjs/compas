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
 * @param {TypeBuilderLike|undefined} value
 * @returns {*}
 */
export function buildOrInfer(value: TypeBuilderLike | undefined): any;
//# sourceMappingURL=utils.d.ts.map
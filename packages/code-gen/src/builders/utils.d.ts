/**
 * @param value
 * @returns {value is
 *   Omit<import("../experimental/generated/common/types").ExperimentalNamedTypeDefinition,
 *   "name"|"group"> & { name: string, group: string,
 *   }}
 */
export function isNamedTypeBuilderLike(value: any): value is Omit<
  import("../experimental/generated/common/types").ExperimentalBooleanDefinition,
  "name" | "group"
> & {
  name: string;
  group: string;
};
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

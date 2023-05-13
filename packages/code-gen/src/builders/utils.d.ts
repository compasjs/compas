/**
 * @param value
 * @returns {value is
 *   Omit<import("../generated/common/types").StructureNamedTypeDefinition,
 *   "name"|"group"> & { name: string, group: string,
 *   }}
 */
export function isNamedTypeBuilderLike(value: any): value is Omit<
  import("../generated/common/types").StructureNamedTypeDefinition,
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
 * @returns {any}
 */
export function buildOrInfer(value: any): any;
//# sourceMappingURL=utils.d.ts.map

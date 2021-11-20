/**
 * @callback StateFn
 * @param {import("../../generated/common/types").CodeGenTemplateState} state
 * @returns {boolean|number|string|undefined|StateFn|Function}
 */
/**
 * @param {TemplateStringsArray | string[]} strings
 * @param {...((StateFn|string|any) | (StateFn|string|any)[])} args
 * @returns {string}
 */
export function js(
  strings: TemplateStringsArray | string[],
  ...args: ((StateFn | string | any) | (StateFn | string | any)[])[]
): string;
export type StateFn = (
  state: import("../../generated/common/types").CodeGenTemplateState,
) => boolean | number | string | undefined | StateFn | Function;
//# sourceMappingURL=tag.d.ts.map

/**
 * @param {string} name
 * @param {string} str
 * @param {{ debug?: boolean }} [opts={}]
 */
export function compileTemplate(
  name: string,
  str: string,
  opts?:
    | {
        debug?: boolean | undefined;
      }
    | undefined,
): void;
/**
 * @param {string} dir
 * @param {string} extension
 * @param {import("@compas/stdlib").ProcessDirectoryOptions} [opts]
 */
export function compileTemplateDirectory(
  dir: string,
  extension: string,
  opts?:
    | import("@compas/stdlib/types/advanced-types").ProcessDirectoryOptions
    | undefined,
): void;
/**
 * @param {string} name
 * @param {*} data
 * @returns {string}
 */
export function executeTemplate(name: string, data: any): string;
/**
 * @type {{context: Record<string, Function>, globals: Record<string, Function>}}
 */
export const templateContext: {
  context: Record<string, Function>;
  globals: Record<string, Function>;
};
//# sourceMappingURL=template.d.ts.map

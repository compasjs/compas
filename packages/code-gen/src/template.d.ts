/**
 * @param {string} name
 * @param {string} str
 * @param {{ debug?: boolean }} [opts={}]
 */
export function compileTemplate(name: string, str: string, opts?: {
    debug?: boolean | undefined;
} | undefined): void;
/**
 * @param {string} dir
 * @param {string} extension
 * @param {ProcessDirectoryOptions} [opts]
 */
export function compileTemplateDirectory(dir: string, extension: string, opts?: import("@compas/stdlib/types/advanced-types").ProcessDirectoryOptions | undefined): void;
/**
 * @param {string} name
 * @param {*} data
 * @returns {string}
 */
export function executeTemplate(name: string, data: any): string;
/**
 * @typedef {import("@compas/stdlib")
 *   .ProcessDirectoryOptions
 * } ProcessDirectoryOptions
 */
/**
 * @type {{context: Object<string, Function>, globals: Object<string, Function>}}
 */
export const templateContext: {
    context: {
        [x: string]: Function;
    };
    globals: {
        [x: string]: Function;
    };
};
export type ProcessDirectoryOptions = import("@compas/stdlib").ProcessDirectoryOptions;
//# sourceMappingURL=template.d.ts.map
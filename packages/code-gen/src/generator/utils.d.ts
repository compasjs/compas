/**
 * @typedef {{
 *   print: (() => string),
 *   destructureImport: ((value: string, pkg: string) => void),
 *   starImport: ((alias: string, pkg: string) => void),
 *   commonjsImport: ((alias: string, pkg: string) => void),
 *   rawImport: ((value: string) => void),
 * }} ImportCreator
 */
/**
 * Clean template output by removing redundant new lines
 *
 * @param {string} str
 * @returns {string}
 */
export function cleanTemplateOutput(str: string): string;
/**
 * Manage imports for a file
 *
 * @returns {ImportCreator}
 */
export function importCreator(): ImportCreator;
export type ImportCreator = {
    print: (() => string);
    destructureImport: (value: string, pkg: string) => void;
    starImport: (alias: string, pkg: string) => void;
    commonjsImport: (alias: string, pkg: string) => void;
    rawImport: (value: string) => void;
};
//# sourceMappingURL=utils.d.ts.map
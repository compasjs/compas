/**
 * @typedef {object} CollectedScript
 * @property {"user"|"package"} type
 * @property {string} name
 * @property {string|undefined} [path]
 * @property {string|undefined} [script]
 */
/**
 * @typedef {{[k: string]: CollectedScript}} ScriptCollection
 */
/**
 * @typedef {object} CliWatchOptions
 *
 * Scripts can export this to control if and how they
 * will be watched.
 *
 * Example:
 * ```
 * export const cliWatchOptions = {
 *   disable: false,
 *   extensions: ["js"],
 *   ignoredPatterns: ["docs"]
 * };
 * ```
 *
 * @property {boolean|undefined} [disable] Disable watch mode
 * @property {string[]|undefined} [extensions] Array of extensions to watch. Defaults to
 *    `["js", "json", "mjs", "cjs"]`.
 * @property {(string|RegExp)[]|undefined} [ignoredPatterns] Ignore specific patterns.
 *    Always ignores node_modules and `.dotfiles`.
 */
/**
 * @typedef {object} NonNullableWatchOptions
 * @property {boolean} disable
 * @property {string[]} extensions
 * @property {(string|RegExp)[]} ignoredPatterns
 */
/**
 * Load scripts directory and package.json scripts.
 *
 * @returns {ScriptCollection}
 */
export function collectScripts(): ScriptCollection;
/**
 * Not so fool proof way of returning the accepted cli arguments of Node.js and v8
 *
 * @returns {Promise<string[]>}
 */
export function collectNodeArgs(): Promise<string[]>;
/**
 * @param {*} [options]
 * @returns {NonNullableWatchOptions}
 */
export function watchOptionsWithDefaults(options?: any): NonNullableWatchOptions;
/**
 * Compiles an chokidar ignore array for the specified options
 *
 * @param {NonNullableWatchOptions} options
 * @returns {function(string): boolean}
 */
export function watchOptionsToIgnoredArray(options: NonNullableWatchOptions): (arg0: string) => boolean;
/**
 * @param logger
 * @param verbose
 * @param watch
 * @param command
 * @param commandArgs
 * @param {CliWatchOptions|NonNullableWatchOptions|undefined} watchOptions
 * @returns {Promise<{ exitCode: number}|void>|void}
 */
export function executeCommand(logger: any, verbose: any, watch: any, command: any, commandArgs: any, watchOptions: CliWatchOptions | NonNullableWatchOptions | undefined): Promise<{
    exitCode: number;
} | void> | void;
export type CollectedScript = {
    type: "user" | "package";
    name: string;
    path?: string | undefined;
    script?: string | undefined;
};
export type ScriptCollection = {
    [k: string]: CollectedScript;
};
/**
 * Scripts can export this to control if and how they
 * will be watched.
 *
 * Example:
 * ```
 * export const cliWatchOptions = {
 *   disable: false,
 *   extensions: ["js"],
 *   ignoredPatterns: ["docs"]
 * };
 * ```
 */
export type CliWatchOptions = {
    /**
     * Disable watch mode
     */
    disable?: boolean | undefined;
    /**
     * Array of extensions to watch. Defaults to
     * `["js", "json", "mjs", "cjs"]`.
     */
    extensions?: string[] | undefined;
    /**
     * Ignore specific patterns.
     * Always ignores node_modules and `.dotfiles`.
     */
    ignoredPatterns?: (string | RegExp)[] | undefined;
};
export type NonNullableWatchOptions = {
    disable: boolean;
    extensions: string[];
    ignoredPatterns: (string | RegExp)[];
};
//# sourceMappingURL=utils.d.ts.map
/**
 * Represents either a file in the `scripts` directory or a script from the package.json
 * Depending on the type contains either script or path
 */
export interface CollectedScript {
  type: "user" | "package";
  name: string;
  path?: string;
  script?: string;
}

export interface ScriptCollection {
  [k: string]: CollectedScript;
}

/**
 * Return collection of available named scripts
 * - type user: User defined scripts from process.cwd/scripts/*.js
 * - type package: User defined scripts in package.json. These override 'user' scripts
 */
export function collectScripts(): ScriptCollection;

/**
 * Scripts can export this to control if and how they will be watched
 *
 * @example
 * ```js
 *   // @type {CliWatchOptions}
 *   export const cliWatchOptions = {
 *     disable: false,
 *     extensions: ["js"],
 *     ignoredPatterns: ["docs"]
 *   };
 * ```
 */
export interface CliWatchOptions {
  /**
   * Disable watch mode
   */
  disable?: boolean;

  /**
   * Array of extensions to watch
   * Defaults to ["js", "json", "mjs", "cjs"]
   */
  extensions?: string[];

  /**
   * Ignore specific patterns
   * Can be strings or RegExp instances
   * Always ignores node_modules and `.dotfiles`
   */
  ignoredPatterns?: (string | RegExp)[];
}

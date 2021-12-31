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
 * Load scripts directory and package.json scripts.
 *
 * @returns {ScriptCollection}
 */
export function collectScripts(): ScriptCollection;
export type CollectedScript = {
  type: "user" | "package";
  name: string;
  path?: string | undefined;
  script?: string | undefined;
};
export type ScriptCollection = {
  [k: string]: CollectedScript;
};
//# sourceMappingURL=utils.d.ts.map

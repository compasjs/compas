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

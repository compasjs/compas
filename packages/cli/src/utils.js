import { existsSync, readdirSync, readFileSync } from "fs";
import { pathJoin } from "@compas/stdlib";

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
export function collectScripts() {
  /** @type {ScriptCollection} */
  const result = {};

  const userDir = pathJoin(process.cwd(), "scripts");
  if (existsSync(userDir)) {
    for (const item of readdirSync(userDir)) {
      if (!item.endsWith(".js")) {
        continue;
      }

      const name = item.split(".")[0];

      result[name] = {
        type: "user",
        name,
        path: pathJoin(userDir, item),
      };
    }
  }

  const pkgJsonPath = pathJoin(process.cwd(), "package.json");
  if (existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
    for (const name of Object.keys(pkgJson.scripts || {})) {
      result[name] = {
        type: "package",
        name,
        script: pkgJson.scripts[name],
      };
    }
  }

  return result;
}

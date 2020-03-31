import { dirnameForModule } from "@lbu/stdlib";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

/**
 * Return collection of available named scripts
 * - type CLI: Internal scripts
 * - type USER: User defined scripts from process.cwd/scripts/*.js
 * - type PKG: User defined scripts in package.json
 * @return {Object.<string, {type: "CLI"|"USER"|"PKG", path?: string, script?: string}>}
 */
export function getKnownScripts() {
  const result = {};

  const cliDir = join(dirnameForModule(import.meta), "../scripts");
  for (const item of readdirSync(cliDir)) {
    const name = item.split(".")[0];

    result[name] = {
      type: "CLI",
      path: join(cliDir, item),
    };
  }

  const userDir = join(process.cwd(), "scripts");
  if (existsSync(userDir)) {
    for (const item of readdirSync(userDir)) {
      const name = item.split(".")[0];

      result[name] = {
        type: "USER",
        path: join(userDir, item),
      };
    }
  }

  const pkgJsonPath = join(process.cwd(), "package.json");
  if (existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
    for (const item of Object.keys(pkgJson.scripts || {})) {
      result[item] = { type: "PKG", script: pkgJson.scripts[item] };
    }
  }

  return result;
}

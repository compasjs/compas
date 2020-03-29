import { dirnameForModule } from "@lbu/stdlib";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

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
      result[item] = { type: "YARN", script: pkgJson.scripts[item] };
    }
  }

  return result;
}

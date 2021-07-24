import { rmSync } from "fs";
import { mainFn, processDirectoryRecursiveSync, spawn } from "@compas/stdlib";

mainFn(import.meta, main);

export async function main() {
  const arg = process.argv[2];

  const cleanOnly = arg === "--clean";
  cleanUpTypeDefinitionFiles();

  if (cleanOnly) {
    return;
  }

  await spawn("yarn", ["tsc", "-p", "./jsconfig.types.json"]);
}

function cleanUpTypeDefinitionFiles() {
  const files = [];
  processDirectoryRecursiveSync(process.cwd(), (file) => {
    // Exclude global generated types
    if (file.includes("types/generated/common/")) {
      return;
    }

    if (file.endsWith("advanced-types.d.ts")) {
      // Exclude advanced-types.d.ts for
      return;
    }

    if (file.endsWith(".d.ts") || file.endsWith(".d.ts.map")) {
      files.push(file);
    }
  });

  for (const file of files) {
    rmSync(file, {});
  }
}

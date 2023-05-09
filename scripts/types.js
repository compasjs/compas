import { rmSync } from "fs";
import { mainFn, processDirectoryRecursiveSync, spawn } from "@compas/stdlib";

mainFn(import.meta, main);

export async function main() {
  const arg = process.argv[2];

  const cleanOnly = arg === "clean";
  cleanUpTypeDefinitionFiles();

  if (cleanOnly) {
    return;
  }

  const { exitCode } = await spawn("npx", [
    "tsc",
    "-p",
    "./jsconfig.types.json",
  ]);

  process.exit(exitCode);
}

function cleanUpTypeDefinitionFiles() {
  const files = [];
  processDirectoryRecursiveSync(process.cwd(), (file) => {
    if (file.includes("generated/common/types")) {
      // Exclude generated directory
      return;
    }

    if (file.includes("types/compas.d.ts")) {
      // Exclude compas global definition
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

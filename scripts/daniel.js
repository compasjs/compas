import { App } from "@compas/code-gen";
import { mainFn } from "@compas/stdlib";

mainFn(import.meta, main);

async function main() {
  const app = new App({
    verbose: true,
  });

  await app.generateOpenApi({
    inputPath: "/Users/danielhansen/ligthbase/diks-backend/src/generated/app",
    outputFile: "./docs/openapi.json",
    enabledGroups: ["account"],
  });
}

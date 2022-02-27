import { App } from "@compas/code-gen";
import { mainFn } from "@compas/stdlib";
import { storeStructure } from "@compas/store";
import { extendWithAuth } from "../gen/auth.js";

mainFn(import.meta, main);

async function main() {
  const app = new App();

  app.extend(storeStructure);
  extendWithAuth(app);

  await app.generate({
    isNodeServer: true,
    enabledGenerators: ["type", "validator", "router", "sql", "apiClient"],
    outputDirectory: "./src/generated",
  });
}

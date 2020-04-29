import { App, coreTypes, generators, TypeCreator } from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";

mainFn(import.meta, log, main);

export const nodemonArgs = "--ignore src/generated";

async function main() {
  const app = new App({
    types: coreTypes,
    generators: [
      generators.validator,
      generators.apiClient,
      generators.mock,
      generators.model,
      generators.router,
    ],
    verbose: true,
    outputDir: "./src/generated",
  });

  await app.init();

  const M = new TypeCreator();
  const myObject = M.object("MyObject", {
    id: M.uuid(),
    userName: M.string().mock("__.first"),
  });

  app.model(myObject);

  const router = M.router("/app");
  app.route(router.get().response(myObject));

  await app.generate();
}

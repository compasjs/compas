import { App, generators, TypeCreator } from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";

mainFn(import.meta, log, main);

export const nodemonArgs = "--ignore src/generated";

async function main() {
  const app = new App({
    generators: [
      generators.type,
      generators.validator,
      generators.mock,
      generators.router,
      generators.apiClient,
    ],
    verbose: true,
  });
  await app.init();

  const M = new TypeCreator();
  const myObject = M.object("MyObject", {
    id: M.uuid(),
    userName: M.string().mock("__.first"),
  });

  app.add(myObject);

  const router = M.router("/app");
  app.add(router.get().response(myObject));

  await app.generate({
    outputDirectory: "./src/generated",
    useTypescript: false,
  });
}

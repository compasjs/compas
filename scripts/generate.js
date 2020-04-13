import { App, generators, R, TypeCreator } from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";

mainFn(import.meta, log, main);

export const nodemonArgs = "--ignore generated -e tmpl,js,json";

async function main() {
  const app = new App({
    generators: [
      generators.model,
      generators.validator,
      generators.mock,
      generators.router,
      generators.apiClient,
    ],
    verbose: true,
    outputDir: "./generated",
    useTypescript: false,
  });
  await app.init();

  const M = new TypeCreator();

  app.validator(
    M.object("User", {
      id: M.number().integer().min(0).max(100).convert(),
      name: M.string().min(1).max(15).mock("__.first"),
      age: M.number().integer().min(0).max(150).convert().mock("__.age"),
    }),
  );

  app.validator(
    M.object("Items", {
      userId: M.ref("AppUser", "id"),
      name: M.string(),
      count: M.number().integer(),
    }),
  );

  const myGeneric = M.generic("MyGeneric")
    .keys(M.string())
    .values(M.anyOf([M.bool().convert(), M.number()]))
    .docs("Foo");

  app.model(M.array("GenericArray").values(myGeneric));

  app.route(R.get("/foo", "test").query(M.ref("AppUser")));

  await app.generate();
}

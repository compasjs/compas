import { App, coreTypes, generators, R, TypeCreator } from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";

mainFn(import.meta, log, main);

export const nodemonArgs = "--ignore generated -e tmpl,js,json";

async function main(logger) {
  const app = new App({
    generators: [
      generators.model,
      generators.validator,
      generators.mock,
      generators.router,
      generators.apiClient,
    ],
    types: [...coreTypes],
    verbose: true,
    outputDir: "./generated",
    useTypescript: false,
  });
  await app.init();

  const M = new TypeCreator();

  app.model(M.bool("Foo").optional().convert().default(true));
  app.model(M.anyOf("Bar", M.bool(), M.bool().optional().default(true)));
  app.model(
    M.object("Obj").keys({
      foo: M.array(M.number().optional()),
    }),
  );

  app.model(M.string("Str"));
  app.model(
    M.object("Objec", {
      str: M.reference("AppStr"),
    }),
  );
  app.validator(
    M.object("User", {
      id: M.number().integer().min(0).max(100).convert(),
      name: M.string().min(1).max(15).mock("__.first"),
      age: M.number().integer().min(0).max(150).convert().mock("__.age"),
    }),
  );

  app.validator(
    M.object("Items", {
      userId: M.reference("AppUser"),
      name: M.string(),
      count: M.number().integer(),
    }),
  );

  const myGeneric = M.generic("MyGeneric")
    .keys(M.string())
    .values(M.anyOf([M.bool().convert(), M.number()]))
    .docs("Foo");

  app.model(M.array("GenericArray").values(myGeneric));

  app.route(R.get("/foo", "test").query(M.reference("AppUser")));

  logger.info(await app.dump());
}

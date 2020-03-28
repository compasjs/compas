import {
  App,
  getApiClientPlugin,
  getMocksPlugin,
  getRouterPlugin,
  getTypesPlugin,
  getValidatorPlugin,
  M,
  R,
  runCodeGen,
} from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";

mainFn(import.meta, log, main);

export const nodemonArgs = "--ignore generated -e tmpl,js,json";

async function main(logger) {
  const app = createApp();
  // Code gen validators
  await runCodeGen(logger, () => app.build()).build({
    plugins: [
      getTypesPlugin({ emitTypescriptTypes: false }),
      getValidatorPlugin(),
      getRouterPlugin(),
      getMocksPlugin(),
      getApiClientPlugin(),
    ],
    outputDir: "./generated",
  });
}

function createApp() {
  const app = new App("TODO App");

  app.validator(
    M.object("User", {
      id: M.number().integer().min(0).max(100).convert(),
      name: M.string().min(1).max(15).mock("__.first"),
      age: M.number().integer().min(0).max(150).convert().mock("__.age"),
    }),
  );

  app.validator(
    M.object("Items", {
      userId: M.ref("User", "id"),
      name: M.string(),
      count: M.number().integer(),
    }),
  );

  app.model(
    M.generic("MyGeneric")
      .keys(M.string())
      .values(M.anyOf([M.bool().convert(), M.number()]))
      .docs("Foo"),
  );

  app.route(R.get("/foo", "test").query(M.ref("User")));

  return app;
}

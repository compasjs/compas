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

const app = new App("TODO App");

app.validator(
  M("User").object({
    id: M.number().integer().min(0).max(100).convert(),
    name: M.string().min(1).max(15).mock("__.first"),
    age: M.number().integer().min(0).max(150).convert().mock("__.age"),
  }),
);

app.validator(
  M("Items").object({
    userId: M.ref("User", "id"),
    name: M.string(),
    count: M.number().integer(),
  }),
);

app.model(
  M("MyGeneric")
    .generic()
    .keys(M.string())
    .values(M.anyOf(M.bool().convert(), M.number()))
    .docs("Foo"),
);

app.route(R("test", "/test").get().query(M.ref("User")));

const main = async (logger) => {
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
};

mainFn(import.meta, log, main);

export const nodemonArgs = "--ignore generated -e tmpl,js,json";

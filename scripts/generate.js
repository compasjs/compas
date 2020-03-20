import {
  App,
  getApiClientPlugin,
  getMocksPlugin,
  getRouterPlugin,
  getTypesPlugin,
  getValidatorPlugin,
  M,
  runCodeGen,
} from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";

const app = new App("TODO App");

app.validator(
  M("User").object({
    id: M.number()
      .integer()
      .min(0)
      .max(100),
    name: M.string()
      .min(1)
      .max(15)
      .mock("__.first"),
    age: M.number()
      .integer()
      .min(0)
      .max(150)
      .mock("__.age"),
  }),
);

app.validator(
  M("Items").object({
    userId: M.ref("User", "id"),
    name: M.string(),
    count: M.number().integer(),
  }),
);

const main = async logger => {
  // Code gen validators
  await runCodeGen(logger, () => app.build()).build({
    plugins: [
      getTypesPlugin(),
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

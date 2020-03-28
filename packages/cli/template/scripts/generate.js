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

mainFn(import.meta, log, main);

export const nodemonArgs = "--ignore generated -e tmpl,js,json";

async function main(logger) {
  const app = createApp();
  // Code gen validators
  await runCodeGen(logger, () => app.build()).build({
    plugins: [
      getTypesPlugin(),
      getValidatorPlugin(),
      getRouterPlugin(),
      getMocksPlugin(),
      getApiClientPlugin(),
    ],
    outputDir: "./src/generated",
  });
}

function createApp() {
  const app = new App("TODO App");

  app.model(
    M.object("MyObject", {
      userName: M.string().mock("__.first"),
    }),
  );

  return app;
}

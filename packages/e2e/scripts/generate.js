import {
  App,
  getApiClientPlugin,
  getMocksPlugin,
  getRouterPlugin,
  getTypesPlugin,
  getValidatorPlugin,
  runCodeGen,
} from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";
import { todoModel, unimplementedModel } from "../src/index.js";

mainFn(import.meta, log, main);

export const nodemonArgs = "--ignore src/generated";

async function main(logger) {
  const app = new App("E2E Todo");
  todoModel(app);
  unimplementedModel(app);

  await runCodeGen(logger, () => app.build()).build({
    plugins: [
      getTypesPlugin(),
      getValidatorPlugin(),
      getRouterPlugin(),
      getApiClientPlugin(),
      getMocksPlugin(),
    ],
    outputDir: "./src/generated",
    verbose: true,
  });
}

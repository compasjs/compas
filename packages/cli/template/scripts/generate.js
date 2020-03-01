import {
  App,
  getRouterPlugin,
  getTypescriptPlugin,
  getValidatorPlugin,
  M,
  R,
  runCodeGen,
} from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";

const app = new App("Test App");

const myBool = M("MyBool")
  .bool()
  .convert()
  .optional();

app.validator(myBool);
app.route(R("foo", "/foo").get());

const main = async logger => {
  logger.info(app.build());
  // Code gen validators
  await runCodeGen(logger, () => app.build()).build({
    plugins: [getValidatorPlugin(), getRouterPlugin(), getTypescriptPlugin()],
    outputDir: "./generated",
  });
};

mainFn(import.meta, log, main);

export const nodemonArgs = "--ignore generated -e tmpl,js,json";

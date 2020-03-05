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

const todoRouter = R("todo", "/todo");

app.route(todoRouter.get());
app.route(todoRouter.post());

const myBool = M("MyBool")
  .bool()
  .convert()
  .optional();

app.model(myBool);

const myRef = M("MyRef").ref("MyBool");

const myObj = M("MyObj").object({
  bool: myBool,
  refBool: myRef,
});

app.validator(myObj);
app.route(
  R("foo", "/foo")
    .get()
    .query(myObj)
    .tags("foo"),
);

const main = async logger => {
  // Code gen validators
  await runCodeGen(logger, () => app.build()).build({
    plugins: [getValidatorPlugin(), getRouterPlugin(), getTypescriptPlugin()],
    outputDir: "./generated",
  });
};

mainFn(import.meta, log, main);

export const nodemonArgs = "--ignore generated -e tmpl,js,json";

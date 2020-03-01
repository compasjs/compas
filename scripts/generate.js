const { mainFn } = require("@lbu/stdlib");
const {
  runCodeGen,
  getRouterPlugin,
  getValidatorPlugin,
  getTypescriptPlugin,
  App,
  M,
  R,
} = require("@lbu/code-gen");
const { log } = require("@lbu/insight");

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

mainFn(module, require, log, main);

module.exports = {
  nodemonArgs: `--ignore generated -e tmpl,js,json`,
};

const { mainFn } = require("@lbu/stdlib");
const {
  getRouterPlugin,
  getValidatorsPlugin,
  runCodeGen,
  FluentApp,
  V,
} = require("@lbu/code-gen");
const { log } = require("@lbu/insight");

const app = new FluentApp();
app.validator("MyObject", V.bool().optional());
app.validator(
  "MyNumber",
  V.number()
    .integer()
    .oneOf(10, 15),
);
app
  .validator(
    "MyString",
    V.string()
      .trim()
      .convert()
      .lowerCase()
      .docs("My string is trimmed automagically"),
  )

  .validator(
    "MyObject",
    V.object({
      foo: V.bool(),
      bar: V.number().optional(),
    })
      .strict()
      .docs("Simple object example"),
  );

app.validator("MyArray", V.array(V.ref("MyString")));

app
  .get("getFoo")
  .tags("foo")
  .path("/foo")
  .query(
    V.object({
      cursor: V.number()
        .optional()
        .convert(),
    }),
  );

app
  .post("postBar")
  .tags("bar", "foo")
  .path("/foo/bar")
  .body(
    V.object({
      foo: V.bool().convert(),
    }),
  );

app
  .post("getBarById")
  .tags("foo", "bar")
  .path("/foo/bar/:id")
  .params(
    V.object({
      id: V.number().convert(),
    }),
  );

app
  .post("getBarByIdGoingWild")
  .tags("foo", "bar")
  .path("/foo/bar/:id/*")
  .params(
    V.object({
      id: V.number().convert(),
    }),
  );

const main = async logger => {
  // Code gen validators
  await runCodeGen(logger, app.callback()).build({
    plugins: [getValidatorsPlugin(), getRouterPlugin()],
    outputDir: "./generated",
  });
};

mainFn(module, require, log, main);

module.exports = {
  nodemonArgs: `--ignore generated -e tmpl,js,json`,
};

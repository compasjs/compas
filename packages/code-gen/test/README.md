# Code-gen tests

The code generators are tested with 2 different kinds of tests:

- Target behaviour tests
- Structure modification tests

## Target behaviour tests

Check if all targets share the same behaviour for things like route matching and
validation.

- `test/spec/structure.js` -> the input structure on which the behaviours are
  specified
- `test/spec/specification.js` -> the behaviour specification containing various
  suites with assertions
- `test/spec/specs.test.js` -> execute the target behaviour tests, validating if
  all assertions are executed
- `test/spec-implementations` -> targets which support running the behaviour
  suite.

## Generator tests

All generator tests execute the full generator and match on one of the
following:

- An error which should have occurred while transforming and checking the
  structure
  - E.g `t.ok(e.messages[0].includes("foo bar baz"))`
- Check if the produced type is valid by running some inputs through the
  generated validator
  - E.g `t.equal(validateFooBar("").error["$"].key, "validator.length")`
- Statically assert on the output files
  - E.g `t.ok(typesOutputFile.includes("type Foo = string;"));`
- Execute the generated code to check target-specific behaviour
  - E.g `t.equal((await queryFoo().exec(sql)).length, 0);`

Each variant has different test abstractions to use:

```js
const buildersFn = () => [];

t.test("error test", (t) => {
  testGeneratorError(
    t,
    {
      partialError: "foo",
      generateOptions: {
        /* optionally pass in generate options */
      },
    },
    buildersFn,
  );

  testGeneratorError(
    t,
    {
      pass: true,
      generateOptions: {
        /* optionally pass in generate options */
      },
    },
    buildersFn,
  );
});

t.test("produced type test", async (t) => {
  const { value, error } = await testGeneratorType(
    t,
    {
      group: "foo",
      name: "validateFooBar",
      validatorInput: "",
      generateOptions: {
        /* optionally pass in generate options */
      },
    },
    buildersFn,
  );

  t.equal(error.$, "validator.length");
});

t.test("static output file", (t) => {
  testGeneratorStaticOutput(
    t,
    {
      outputFile: "./common/types.d.ts",
      includes: "type Foo = string",
      generateOptions: {
        /* optionally pass in generate options */
      },
    },
    buildersFn,
  );
});

t.test("execute target test", async (t) => {
  const outputDirectory = testGeneratorDynamicOutput(
    t,
    {
      generateOptions: {
        /* optionally pass in generate options */
      },
    },
    buildersFn,
  );

  const structure = JSON.parse(
    readFileSync(outputDirectory + "common/structure.json", "utf-8"),
  );

  t.equal(Object.keys(structure).length, 3);
});
```

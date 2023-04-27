# Code-gen tests

The code generators are tested with 2 different kinds of tests:

- Target behaviour tests
- Generator tests
- E2E tests

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
- Dynamically assert on the output files
  - E.g
    `t.ok(generatedFiles.find(it => it.relativePath === "common/structure.json")));`

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

t.test("static output check", (t) => {
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

t.test("static files list", (t) => {
  const outputFiles = testGeneratorStaticFiles(t, {}, buildersFn);

  t.equal(outputFiles.length, 4);
});
```

## E2E tests

For execution of the generated code that does not belong in target beaviour
tests or generator tests, we have E2E tests. We write these in the form of
examples, showing a minimal e2e flow of various features.

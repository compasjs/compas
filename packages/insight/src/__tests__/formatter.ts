import "jest";
import { format, recursiveFlattenObject } from "../formatting";

test("recursiveFlattenObject supports base types and converts to message", () => {
  const cases: {
    input: any;
    output: any;
    depth: number;
  }[] = [
    {
      input: 5,
      depth: 1,
      output: { message: "5" },
    },
    {
      input: "foo",
      depth: 1,
      output: { message: "foo" },
    },
    {
      input: true,
      depth: 1,
      output: { message: "true" },
    },
    {
      input: null,
      depth: 1,
      output: {},
    },
  ];

  for (const test of cases) {
    const result = {};
    recursiveFlattenObject(test.input, test.depth, result);
    expect(test.output).toEqual(result);
  }
});

test("recursiveFlattenObject respects depth", () => {
  const result = {};
  recursiveFlattenObject(
    {
      foo: {
        bar: {
          baz: "1",
        },
      },
    },
    1,
    result,
  );

  expect(result).toEqual({
    foo: {},
  });
});

test("recursiveFlattenObject overwrites all keys except message", () => {
  const result: any = { foo: "bar", message: "Hello" };
  recursiveFlattenObject(
    {
      foo: "baz",
    },
    3,
    result,
  );
  recursiveFlattenObject("World!", 3, result);

  expect(result).toEqual({ foo: "baz", message: "Hello World!" });
});

test("recursiveFlattenObject handles arrays", () => {
  const result = {};
  recursiveFlattenObject({ arr: [5, 2, 3, { foo: "bar" }] }, 5, result);

  expect(result).toEqual({
    arr: [{ message: "5" }, { message: "2" }, { message: "3" }, { foo: "bar" }],
  });
});

test("recursiveFlattenObject handles classes", () => {
  const result = {};
  recursiveFlattenObject(
    new (class X {
      private readonly x: number;
      private readonly y: number;
      constructor() {
        this.x = 5;
        this.y = 5;
      }
      foo() {
        return this.x + this.y;
      }
    })(),
    5,
    result,
  );
  expect(result).toEqual({ x: 5, y: 5 });
});

test("format should reject top level arrays", () => {
  expect(() => format(5, [[]])).toThrow();
});

test("format should merge all args in a single result", () => {
  expect(format(5, [{ foo: "bar" }, "baz", { foo: "qux" }])).toEqual({
    foo: "qux",
    message: "baz",
  });
});

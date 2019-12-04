import "jest";
import { format, recursiveCopyObject } from "../logger";

test("recursiveCopyObject supports base types and converts to message", () => {
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
    recursiveCopyObject(test.input, test.depth, result);
    expect(test.output).toEqual(result);
  }
});

test("recursiveCopyObject respects depth", () => {
  const result = {};
  recursiveCopyObject(
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

test("recursiveCopyObject overwrites all keys except message", () => {
  const result: any = { foo: "bar", message: "Hello" };
  recursiveCopyObject(
    {
      foo: "baz",
    },
    3,
    result,
  );
  recursiveCopyObject("World!", 3, result);

  expect(result).toEqual({ foo: "baz", message: "Hello World!" });
});

test("recursiveCopyObject handles arrays", () => {
  const result = {};
  recursiveCopyObject({ arr: [5, 2, 3, { foo: "bar" }] }, 5, result);

  expect(result).toEqual({
    arr: [{ message: "5" }, { message: "2" }, { message: "3" }, { foo: "bar" }],
  });
});

test("recursiveCopyObject handles classes", () => {
  const result = {};
  recursiveCopyObject(
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

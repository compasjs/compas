import "jest";
import {
  ArrayValidator,
  BooleanValidator,
  NumberValidator,
  ObjectValidator,
  OneOfValidator,
  StringValidator,
} from "../types/validator";
import {
  createArrayType,
  createBooleanType,
  createNamedArrayType,
  createNamedBooleanType,
  createNamedNumberType,
  createNamedObjectType,
  createNamedOneOfType,
  createNamedStringType,
  createNumberType,
  createObjectType,
  createOneOfType,
  createStringType,
} from "./typings";

test("typings - number", () => {
  const cases: {
    input: NumberValidator;
    output: string;
  }[] = [
    {
      input: { type: "number" },
      output: "number",
    },
    {
      input: {
        type: "number",
        optional: true,
      },
      output: "number | undefined",
    },
    {
      input: {
        type: "number",
        oneOf: [1],
      },
      output: "1",
    },
    {
      input: {
        type: "number",
        oneOf: [1, 2],
      },
      output: "1 | 2",
    },
    {
      input: {
        type: "number",
        oneOf: [1, 2],
        optional: true,
      },
      output: "1 | 2 | undefined",
    },
  ];

  for (const c of cases) {
    expect(createNumberType(c.input)).toBe(c.output);
  }
});

test("typings - named number", () => {
  expect(
    createNamedNumberType({
      type: "number",
      name: "Foo",
    }),
  ).toBe("export type Foo = number;");
});

test("typings - string", () => {
  const cases: {
    input: StringValidator;
    output: string;
  }[] = [
    {
      input: { type: "string" },
      output: "string",
    },
    {
      input: {
        type: "string",
        optional: true,
      },
      output: "string | undefined",
    },
    {
      input: {
        type: "string",
        oneOf: ["foo"],
      },
      output: `"foo"`,
    },
    {
      input: {
        type: "string",
        oneOf: ["foo", "bar"],
      },
      output: `"foo" | "bar"`,
    },
    {
      input: {
        type: "string",
        oneOf: ["foo", "bar"],
        optional: true,
      },
      output: `"foo" | "bar" | undefined`,
    },
  ];

  for (const c of cases) {
    expect(createStringType(c.input)).toBe(c.output);
  }
});

test("typings - named string", () => {
  expect(
    createNamedStringType({
      type: "string",
      name: "Foo",
    }),
  ).toBe("export type Foo = string;");
});

test("typings - boolean", () => {
  const cases: {
    input: BooleanValidator;
    output: string;
  }[] = [
    {
      input: { type: "boolean" },
      output: "boolean",
    },
    {
      input: {
        type: "boolean",
        optional: true,
      },
      output: "boolean | undefined",
    },
    {
      input: {
        type: "boolean",
        oneOf: [true],
      },
      output: `true`,
    },
    {
      input: {
        type: "boolean",
        oneOf: [false],
      },
      output: `false`,
    },
    {
      input: {
        type: "boolean",
        oneOf: [true],
        optional: true,
      },
      output: `true | undefined`,
    },
  ];

  for (const c of cases) {
    expect(createBooleanType(c.input)).toBe(c.output);
  }
});

test("typings - named boolean", () => {
  expect(
    createNamedBooleanType({
      type: "boolean",
      name: "Foo",
    }),
  ).toBe("export type Foo = boolean;");
});

test("typings - object", () => {
  const cases: {
    input: ObjectValidator;
    output: string;
  }[] = [
    {
      input: {
        type: "object",
      },
      output: "{\n}",
    },
    {
      input: {
        type: "object",
        optional: true,
      },
      output: "{\n} | undefined",
    },
    {
      input: {
        type: "object",
        keys: { foo: { type: "number" } },
      },
      output: "{\nfoo: number;\n}",
    },
    {
      input: {
        type: "object",
        keys: { foo: { type: "number" } },
        optional: true,
      },
      output: "{\nfoo: number;\n} | undefined",
    },
  ];

  for (const c of cases) {
    expect(createObjectType(c.input)).toBe(c.output);
  }
});

test("typings - named object", () => {
  expect(
    createNamedObjectType({
      type: "object",
      name: "Foo",
    }),
  ).toBe("export type Foo = {\n};");
});

test("typings - array", () => {
  const cases: {
    input: ArrayValidator;
    output: string;
  }[] = [
    {
      input: {
        type: "array",
        values: { type: "number" },
      },
      output: "(number)[]",
    },
    {
      input: {
        type: "array",
        values: { type: "number" },
        optional: true,
      },
      output: "(number)[] | undefined",
    },
  ];

  for (const c of cases) {
    expect(createArrayType(c.input)).toBe(c.output);
  }
});

test("typings - named array", () => {
  expect(
    createNamedArrayType({
      type: "array",
      name: "Foo",
      values: { type: "number" },
    }),
  ).toBe("export type Foo = (number)[];");
});

test("typings - oneOf", () => {
  const cases: {
    input: OneOfValidator;
    output: string;
  }[] = [
    {
      input: {
        type: "oneOf",
        validators: [{ type: "number" }],
      },
      output: "(number)",
    },
    {
      input: {
        type: "oneOf",
        validators: [{ type: "number" }, { type: "string" }],
      },
      output: "(number) | (string)",
    },
    {
      input: {
        type: "oneOf",
        validators: [{ type: "number" }, { type: "string" }],
        optional: true,
      },
      output: "(number) | (string) | undefined",
    },
  ];

  for (const c of cases) {
    expect(createOneOfType(c.input)).toBe(c.output);
  }
});

test("typings - named oneOf", () => {
  expect(
    createNamedOneOfType({
      type: "oneOf",
      name: "Foo",
      validators: [
        {
          type: "reference",
          ref: "Bar",
        },
      ],
    }),
  ).toBe("export type Foo = (Bar);");
});

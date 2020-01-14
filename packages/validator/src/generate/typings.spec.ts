import "jest";
import {
  ArraySchema,
  BooleanSchema,
  NumberSchema,
  ObjectSchema,
  OneOfSchema,
  StringSchema,
} from "../types";
import {
  createArraySchema,
  createBooleanSchema,
  createNamedArraySchema,
  createNamedBooleanSchema,
  createNamedNumberSchema,
  createNamedObjectSchema,
  createNamedOneOfSchema,
  createNamedStringSchema,
  createNumberSchema,
  createObjectSchema,
  createOneOfSchema,
  createStringSchema,
} from "./typings";

test("typings - number", () => {
  const cases: {
    input: NumberSchema;
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
    expect(createNumberSchema(c.input)).toBe(c.output);
  }
});

test("typings - named number", () => {
  expect(
    createNamedNumberSchema({
      type: "number",
      name: "Foo",
    }),
  ).toBe("export type Foo = number;");
});

test("typings - string", () => {
  const cases: {
    input: StringSchema;
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
    expect(createStringSchema(c.input)).toBe(c.output);
  }
});

test("typings - named string", () => {
  expect(
    createNamedStringSchema({
      type: "string",
      name: "Foo",
    }),
  ).toBe("export type Foo = string;");
});

test("typings - boolean", () => {
  const cases: {
    input: BooleanSchema;
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
    expect(createBooleanSchema(c.input)).toBe(c.output);
  }
});

test("typings - named boolean", () => {
  expect(
    createNamedBooleanSchema({
      type: "boolean",
      name: "Foo",
    }),
  ).toBe("export type Foo = boolean;");
});

test("typings - object", () => {
  const cases: {
    input: ObjectSchema;
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
    expect(createObjectSchema(c.input)).toBe(c.output);
  }
});

test("typings - named object", () => {
  expect(
    createNamedObjectSchema({
      type: "object",
      name: "Foo",
    }),
  ).toBe("export interface Foo {\n}");
});

test("typings - array", () => {
  const cases: {
    input: ArraySchema;
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
    expect(createArraySchema(c.input)).toBe(c.output);
  }
});

test("typings - named array", () => {
  expect(
    createNamedArraySchema({
      type: "array",
      name: "Foo",
      values: { type: "number" },
    }),
  ).toBe("export type Foo = (number)[];");
});

test("typings - oneOf", () => {
  const cases: {
    input: OneOfSchema;
    output: string;
  }[] = [
    {
      input: {
        type: "oneOf",
        schemas: [{ type: "number" }],
      },
      output: "(number)",
    },
    {
      input: {
        type: "oneOf",
        schemas: [{ type: "number" }, { type: "string" }],
      },
      output: "(number) | (string)",
    },
    {
      input: {
        type: "oneOf",
        schemas: [{ type: "number" }, { type: "string" }],
        optional: true,
      },
      output: "(number) | (string) | undefined",
    },
  ];

  for (const c of cases) {
    expect(createOneOfSchema(c.input)).toBe(c.output);
  }
});

test("typings - named oneOf", () => {
  expect(
    createNamedOneOfSchema({
      type: "oneOf",
      name: "Foo",
      schemas: [
        {
          type: "reference",
          ref: "Bar",
        },
      ],
    }),
  ).toBe("export type Foo = (Bar);");
});

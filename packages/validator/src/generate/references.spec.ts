import "jest";
import { Schema } from "../types";
import { checkReferences, createSchemaMapping } from "./references";
import { SchemaMapping } from "./types";

test("create correct schema mapping", () => {
  expect(createSchemaMapping([])).toEqual({});
  expect(createSchemaMapping([{ name: "foo" } as Schema])).toEqual({
    foo: { name: "foo" },
  });
  expect(
    createSchemaMapping([{ name: "foo" } as Schema, { name: "bar" } as Schema]),
  ).toEqual({
    foo: { name: "foo" },
    bar: { name: "bar" },
  });
});

test("check schema references recursively", () => {
  const cases: {
    input: SchemaMapping;
    shouldThrow: boolean;
  }[] = [
    {
      input: {
        foo: {
          type: "number",
          name: "foo",
        },
      },
      shouldThrow: false,
    },
    {
      input: {
        foo: {
          type: "string",
          name: "foo",
        },
      },
      shouldThrow: false,
    },
    {
      input: {
        foo: {
          type: "boolean",
          name: "foo",
        },
      },
      shouldThrow: false,
    },
    {
      input: {
        foo: {
          type: "object",
          name: "foo",
        },
      },
      shouldThrow: false,
    },
    {
      input: {
        foo: {
          type: "array",
          values: { type: "number" },
          name: "foo",
        },
      },
      shouldThrow: false,
    },
    {
      input: {
        foo: {
          type: "oneOf",
          name: "foo",
        },
      },
      shouldThrow: false,
    },
    {
      input: {
        foo: {
          type: "reference",
          name: "foo",
          ref: "Bar",
        },
      },
      shouldThrow: true,
    },
    {
      input: {
        foo: {
          type: "reference",
          name: "foo",
          ref: "bar",
        },
        bar: {
          type: "number",
        },
      },
      shouldThrow: false,
    },
    {
      input: {
        foo: {
          type: "object",
          name: "foo",
          keys: {
            bar: {
              type: "reference",
              ref: "bar",
            },
          },
        },
      },
      shouldThrow: true,
    },
    {
      input: {
        foo: {
          type: "object",
          name: "foo",
          keys: {
            bar: {
              type: "reference",
              ref: "bar",
            },
          },
        },
        bar: { type: "number" },
      },
      shouldThrow: false,
    },
    {
      input: {
        foo: {
          type: "array",
          values: {
            type: "reference",
            ref: "bar",
          },
          name: "foo",
        },
      },
      shouldThrow: true,
    },
    {
      input: {
        foo: {
          type: "array",
          values: {
            type: "reference",
            ref: "bar",
          },
          name: "foo",
        },
        bar: { type: "number" },
      },
      shouldThrow: false,
    },
    {
      input: {
        foo: {
          type: "oneOf",
          name: "foo",
          schemas: [
            {
              type: "reference",
              ref: "bar",
            },
          ],
        },
      },
      shouldThrow: true,
    },
    {
      input: {
        foo: {
          type: "oneOf",
          name: "foo",
          schemas: [
            {
              type: "reference",
              ref: "bar",
            },
          ],
        },
        bar: { type: "number" },
      },
      shouldThrow: false,
    },
    {
      input: {
        foo: {
          type: "reference",
          ref: "bar",
        },
        bar: {
          type: "reference",
          ref: "baz",
        },
      },
      shouldThrow: true,
    },
    {
      input: {
        foo: {
          type: "reference",
          ref: "bar",
        },
        bar: {
          type: "reference",
          ref: "baz",
        },
        baz: { type: "number" },
      },
      shouldThrow: false,
    },
  ];

  for (const c of cases) {
    if (c.shouldThrow) {
      expect(() => checkReferences(c.input)).toThrow();
    } else {
      expect(() => checkReferences(c.input)).not.toThrow();
    }
  }
});

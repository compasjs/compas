import "jest";
import { Validator } from "../types";
import { checkReferences } from "./references";

test("check schema references recursively", () => {
  const cases: {
    input: Validator[];
    shouldThrow: boolean;
  }[] = [
    {
      input: [
        {
          type: "number",
          name: "foo",
        },
      ],
      shouldThrow: false,
    },
    {
      input: [
        {
          type: "string",
          name: "foo",
        },
      ],
      shouldThrow: false,
    },
    {
      input: [
        {
          type: "boolean",
          name: "foo",
        },
      ],
      shouldThrow: false,
    },
    {
      input: [
        {
          type: "object",
          name: "foo",
        },
      ],
      shouldThrow: false,
    },
    {
      input: [
        {
          type: "array",
          values: { type: "number" },
          name: "foo",
        },
      ],
      shouldThrow: false,
    },
    {
      input: [
        {
          type: "oneOf",
          name: "foo",
          validators: [{ type: "number" }],
        },
      ],
      shouldThrow: false,
    },
    {
      input: [
        {
          type: "reference",
          name: "foo",
          ref: "Bar",
        },
      ],
      shouldThrow: true,
    },
    {
      input: [
        {
          type: "reference",
          name: "foo",
          ref: "bar",
        },
        {
          type: "number",
          name: "Bar",
        },
      ],
      shouldThrow: false,
    },
    {
      input: [
        {
          type: "object",
          name: "foo",
          keys: {
            bar: {
              type: "reference",
              ref: "bar",
            },
          },
        },
      ],
      shouldThrow: true,
    },
    {
      input: [
        {
          type: "object",
          name: "foo",
          keys: {
            bar: {
              type: "reference",
              ref: "bar",
            },
          },
        },
        {
          type: "number",
          name: "Bar",
        },
      ],
      shouldThrow: false,
    },
    {
      input: [
        {
          type: "array",
          values: {
            type: "reference",
            ref: "bar",
          },
          name: "foo",
        },
      ],
      shouldThrow: true,
    },
    {
      input: [
        {
          type: "array",
          values: {
            type: "reference",
            ref: "bar",
          },
          name: "foo",
        },
        {
          type: "number",
          name: "Bar",
        },
      ],
      shouldThrow: false,
    },
    {
      input: [
        {
          type: "oneOf",
          name: "foo",
          validators: [
            {
              type: "reference",
              ref: "bar",
            },
          ],
        },
      ],
      shouldThrow: true,
    },
    {
      input: [
        {
          type: "oneOf",
          name: "foo",
          validators: [
            {
              type: "reference",
              ref: "bar",
            },
          ],
        },
        {
          type: "number",
          name: "Bar",
        },
      ],
      shouldThrow: false,
    },
    {
      input: [
        {
          name: "foo",
          type: "reference",
          ref: "bar",
        },
        {
          name: "Bar",
          type: "reference",
          ref: "baz",
        },
      ],
      shouldThrow: true,
    },
    {
      input: [
        {
          name: "foo",
          type: "reference",
          ref: "bar",
        },
        {
          type: "reference",
          ref: "baz",
          name: "bar",
        },
        {
          type: "number",
          name: "Baz",
        },
      ],
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

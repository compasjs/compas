import "jest";
import { booleanSetDefaults, BooleanValidation } from "./rules/boolean";
import { numberSetDefaults, NumberValidation } from "./rules/number";
import { stringSetDefaults, StringValidation } from "./rules/string";

test("boolean defaults", () => {
  const schema: BooleanValidation = { type: "boolean" };

  // empty
  booleanSetDefaults(schema);
  expect(schema.convert).toBe(false);
  expect(schema.optional).toBe(false);

  // all false
  booleanSetDefaults(schema);
  expect(schema.convert).toBe(false);
  expect(schema.optional).toBe(false);

  // keep truthy
  schema.convert = true;
  booleanSetDefaults(schema);
  expect(schema.convert).toBe(true);
  expect(schema.optional).toBe(false);

  schema.optional = true;
  booleanSetDefaults(schema);
  expect(schema.convert).toBe(true);
  expect(schema.optional).toBe(true);
});

test("number defaults", () => {
  const schema: NumberValidation = { type: "number" };

  // all empty
  numberSetDefaults(schema);
  expect(schema.optional).toBe(false);
  expect(schema.convert).toBe(false);
  expect(schema.integer).toBe(false);

  // keep truthy

  schema.optional = true;
  numberSetDefaults(schema);
  expect(schema.optional).toBe(true);

  schema.convert = true;
  numberSetDefaults(schema);
  expect(schema.convert).toBe(true);

  schema.integer = true;
  numberSetDefaults(schema);
  expect(schema.integer).toBe(true);
});

test("string defaults", () => {
  const schema: StringValidation = { type: "string" };

  // all empty
  stringSetDefaults(schema);
  expect(schema.optional).toBe(false);
  expect(schema.convert).toBe(false);
  expect(schema.trim).toBe(false);
  expect(schema.oneOf).toBe(undefined);
  expect(schema.pattern).toBe(undefined);
  expect(schema.length).toBe(undefined);

  // expect to throw
  schema.oneOf = [];
  expect(() => stringSetDefaults(schema)).toThrow(Error);

  schema.pattern = /./g;
  expect(() => stringSetDefaults(schema)).toThrow(Error);

  schema.pattern = undefined;
  schema.oneOf = undefined;

  // keep truthy

  schema.optional = true;
  stringSetDefaults(schema);
  expect(schema.optional).toBe(true);

  schema.trim = true;
  stringSetDefaults(schema);
  expect(schema.trim).toBe(true);

  schema.convert = true;
  stringSetDefaults(schema);
  expect(schema.convert).toBe(true);
});

import "jest";
import { booleanGenerateType, BooleanValidation } from "./rules/boolean";
import { numberGenerateType, NumberValidation } from "./rules/number";
import { stringGenerateType, StringValidation } from "./rules/string";

test("boolean types", () => {
  const schema: BooleanValidation = { type: "boolean" };

  expect(booleanGenerateType("foo", schema)).toBe("foo: boolean;");

  schema.optional = true;
  expect(booleanGenerateType("foo", schema)).toBe("foo?: boolean;");
});

test("number types", () => {
  const schema: NumberValidation = { type: "number" };

  expect(numberGenerateType("foo", schema)).toBe("foo: number;");

  schema.optional = true;
  expect(numberGenerateType("foo", schema)).toBe("foo?: number;");
});

test("string types", () => {
  const schema: StringValidation = { type: "string" };

  expect(stringGenerateType("foo", schema)).toBe("foo: string;");

  schema.optional = true;
  expect(stringGenerateType("foo", schema)).toBe("foo?: string;");

  schema.oneOf = ["bar"];
  expect(stringGenerateType("foo", schema)).toBe(`foo?: "bar";`);

  schema.oneOf = ["bar", "baz"];
  expect(stringGenerateType("foo", schema)).toBe(`foo?: "bar" | "baz";`);

  schema.optional = false;
  expect(stringGenerateType("foo", schema)).toBe(`foo: "bar" | "baz";`);
});

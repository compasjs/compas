import "jest";
import { getValidator, loadValidators } from "../__fixtures__/util";

let generatedValidators: any = {};

beforeAll(() => {
  generatedValidators = loadValidators("Object");
});

test("ObjectSimple", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateObjectSimple",
  );

  expect(validator({ foo: true })).toEqual({ foo: true });
  expect(
    validator({
      foo: true,
      bar: false,
    }),
  ).toEqual({ foo: true });
  expect(() => validator("true")).toThrow(err);
  expect(() => validator(undefined)).toThrow(err);
});

test("ObjectOptional", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateObjectOptional",
  );

  expect(validator(undefined)).toBe(undefined);
  expect(validator({ foo: true })).toEqual({ foo: true });
  expect(() => validator({ foo: "true" })).toThrow(err);
});

test("ObjectKey", () => {
  const { validator } = getValidator(generatedValidators, "validateObjectKey");

  expect(validator({ foo: false })).toEqual({ foo: false });
});

test("ObjectKeys", () => {
  const { validator } = getValidator(generatedValidators, "validateObjectKeys");

  expect(validator({ foo: false })).toEqual({ foo: false });
});

test("ObjectStrict", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateObjectStrict",
  );

  expect(validator({ foo: false })).toEqual({ foo: false });
  expect(() =>
    validator({
      foo: true,
      bar: false,
    }),
  ).toThrow(err);
});

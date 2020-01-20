import "jest";
import { getValidator, loadValidators } from "../__fixtures__/util";

let generatedValidators: any = {};

beforeAll(() => {
  generatedValidators = loadValidators("Boolean");
});

afterAll(() => {
  // removeValidators("Boolean");
});

test("BooleanSimple", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateBooleanSimple",
  );

  expect(validator(true)).toBe(true);
  expect(() => validator("true")).toThrow(err);
  expect(() => validator(undefined)).toThrow(err);
});

test("BooleanOneOf", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateBooleanOneOf",
  );

  expect(validator(true)).toBe(true);
  expect(() => validator(false)).toThrow(err);
});

test("BooleanConvert", () => {
  const { validator } = getValidator(
    generatedValidators,
    "validateBooleanConvert",
  );

  expect(validator("true")).toBe(validator(true));
  expect(validator(1)).toBe(validator(true));
  expect(validator(true)).toBe(validator(true));

  expect(validator("false")).toBe(validator(false));
  expect(validator(0)).toBe(validator(false));
  expect(validator(false)).toBe(validator(false));
});

test("BooleanOptional", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateBooleanOptional",
  );

  expect(validator(undefined)).toBe(undefined);
  expect(validator(true)).toBe(true);
  expect(() => validator("true")).toThrow(err);
});

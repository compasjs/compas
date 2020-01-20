import "jest";
import { getValidator, loadValidators } from "../__fixtures__/util";

let generatedValidators: any = {};

beforeAll(() => {
  generatedValidators = loadValidators("Number");
});

test("NumberSimple", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateNumberSimple",
  );

  expect(validator(5)).toBe(5);
  expect(() => validator(undefined)).toThrow(err);
  expect(() => validator(NaN)).toThrow(err);
  expect(() => validator(Infinity)).toThrow(err);
});

test("NumberInteger", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateNumberInteger",
  );

  expect(validator(5)).toBe(5);
  expect(validator(-5)).toBe(-5);
  expect(() => validator(5.1)).toThrow(err);
});

test("NumberMinMax", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateNumberMinMax",
  );

  expect(validator(5)).toBe(5);
  expect(validator(3)).toBe(3);
  expect(() => validator(6)).toThrow(err);
  expect(() => validator(0)).toThrow(err);
});

test("NumberOneOf", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateNumberOneOf",
  );

  expect(validator(1)).toBe(1);
  expect(validator(2)).toBe(2);
  expect(validator(3)).toBe(3);
  expect(() => validator(5)).toThrow(err);
  expect(() => validator(undefined)).toThrow(err);
  expect(() => validator("1")).toThrow(err);
});

test("NumberConvert", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateNumberConvert",
  );

  expect(validator(1)).toBe(1);
  expect(validator("1")).toBe(1);
  expect(validator("1.11")).toBe(1.11);
  expect(() => validator("1.1ss")).toThrow(err);
});

test("NumberOptional", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateNumberOptional",
  );

  expect(validator(1)).toBe(1);
  expect(validator(undefined)).toBe(undefined);
  expect(() => validator({})).toThrow(err);
});

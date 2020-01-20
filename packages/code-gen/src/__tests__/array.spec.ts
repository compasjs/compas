import "jest";
import { getValidator, loadValidators } from "../__fixtures__/util";

let generatedValidators: any = {};

beforeAll(() => {
  generatedValidators = loadValidators("Array");
});

afterAll(() => {
  // removeValidators("Array");
});

test("ArraySimple", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateArraySimple",
  );

  expect(validator([true])).toEqual([true]);
  expect(() => validator(true)).toThrow(err);
});

test("ArrayConvert", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateArrayConvert",
  );

  expect(validator([true])).toEqual([true]);
  expect(validator(true)).toEqual([true]);
  expect(() => validator("true")).toThrow(err);
});

test("ArrayOptional", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateArrayOptional",
  );

  expect(validator([true])).toEqual([true]);
  expect(validator(undefined)).toEqual(undefined);
  expect(() => validator(["false"])).toThrow(err);
});

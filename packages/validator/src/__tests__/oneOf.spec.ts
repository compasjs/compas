import "jest";
import { getValidator, loadValidators } from "../__fixtures__/util";

let generatedValidators: any = {};

beforeAll(() => {
  generatedValidators = loadValidators("OneOf");
});

afterAll(() => {
  // removeValidators("OneOf");
});

test("OneOfSimple", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateOneOfSimple",
  );

  expect(validator(true)).toBe(true);
  expect(() => validator(5)).toThrow(err);
});

test("OneOfOptional", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateOneOfOptional",
  );

  expect(validator(true)).toBe(true);
  expect(validator(undefined)).toBe(undefined);
  expect(() => validator(["false"])).toThrow(err);
});

test("OneOfMultiple", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateOneOfMultiple",
  );

  expect(validator(true)).toBe(true);
  expect(validator(5)).toBe(5);
  expect(() => validator("str")).toThrow(err);
});

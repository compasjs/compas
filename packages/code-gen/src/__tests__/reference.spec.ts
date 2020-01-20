import "jest";
import { getValidator, loadValidators } from "../__fixtures__/util";

let generatedValidators: any = {};

beforeAll(() => {
  generatedValidators = loadValidators("Reference");
});

test("ReferenceSimple", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateReferenceSimple",
  );

  expect(validator(true)).toBe(true);
  expect(() => validator("true")).toThrow(err);
});

test("ReferenceOptional", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateReferenceOptional",
  );

  expect(validator(true)).toBe(true);
  expect(validator(undefined)).toBe(undefined);
  expect(() => validator("false")).toThrow(err);
});

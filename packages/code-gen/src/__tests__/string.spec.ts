import "jest";
import { getValidator, loadValidators } from "../__fixtures__/util";

let generatedValidators: any = {};

beforeAll(() => {
  generatedValidators = loadValidators("String");
});

test("StringSimple", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateStringSimple",
  );

  expect(validator("foo ")).toBe("foo ");
  expect(() => validator(undefined)).toThrow(err);
});

test("StringMinMax", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateStringMinMax",
  );

  expect(validator("foo")).toBe("foo");
  expect(() => validator("TooLong!")).toThrow(err);
});

test("StringOneOf", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateStringOneOf",
  );

  expect(validator("foo")).toBe("foo");
  expect(() => validator("NotInEnum")).toThrow(err);
});

test("StringConvert", () => {
  const { validator } = getValidator(
    generatedValidators,
    "validateStringConvert",
  );

  expect(validator("5")).toBe(validator(5));
});

test("StringOptional", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateStringOptional",
  );

  expect(validator(undefined)).toBe(undefined);
  expect(validator("foo")).toBe("foo");
  expect(() => validator(5)).toThrow(err);
});

test("StringTrim", () => {
  const { validator } = getValidator(generatedValidators, "validateStringTrim");

  expect(validator(" f o o ")).toBe("f o o");
});

test("StringUpperCase", () => {
  const { validator } = getValidator(
    generatedValidators,
    "validateStringUpperCase",
  );

  expect(validator("fOo")).toBe("FOO");
});

test("StringLowerCase", () => {
  const { validator } = getValidator(
    generatedValidators,
    "validateStringLowerCase",
  );

  expect(validator("fOo")).toBe("foo");
});

test("StringPattern", () => {
  const { err, validator } = getValidator(
    generatedValidators,
    "validateStringPattern",
  );

  expect(validator("aAaA12")).toBe("aAaA12");
  expect(() => validator("aaa12")).toThrow(err);
});

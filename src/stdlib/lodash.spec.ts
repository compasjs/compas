import "jest";
import { isNil, isPlainObject } from "./lodash";

test("isNil returns true for null & undefined", () => {
  expect(isNil(null)).toBeTruthy();
  expect(isNil(undefined)).toBeTruthy();
});

test("isNil returns false for all other inputs", () => {
  expect(isNil(true)).toBeFalsy();
  expect(isNil(false)).toBeFalsy();
  expect(isNil(0)).toBeFalsy();
  expect(isNil(1)).toBeFalsy();
  expect(isNil("")).toBeFalsy();
  expect(isNil("foo")).toBeFalsy();
  expect(isNil({})).toBeFalsy();
  expect(isNil({ foo: "bar" })).toBeFalsy();
  expect(isNil([])).toBeFalsy();
  expect(isNil([1])).toBeFalsy();
  expect(isNil(new (class X {})())).toBeFalsy();
});

test("isPlainObject returns true for normal objects", () => {
  expect(isPlainObject({})).toBeTruthy();
  expect(isPlainObject({ foo: "bar" })).toBeTruthy();
});

test("isPlainObject returns false for all other types", () => {
  expect(isPlainObject(null)).toBeFalsy();
  expect(isPlainObject(undefined)).toBeFalsy();
  expect(isPlainObject(true)).toBeFalsy();
  expect(isPlainObject(false)).toBeFalsy();
  expect(isPlainObject(0)).toBeFalsy();
  expect(isPlainObject(1)).toBeFalsy();
  expect(isPlainObject("")).toBeFalsy();
  expect(isPlainObject("foo")).toBeFalsy();
  expect(isPlainObject([])).toBeFalsy();
  expect(isPlainObject([1])).toBeFalsy();
  expect(isPlainObject(new (class X {})())).toBeFalsy();
});

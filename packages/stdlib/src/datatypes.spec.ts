import "jest";
import { uuid } from "./datatypes";

test("unique uuid for every call", () => {
  expect(uuid()).not.toBe(uuid());
  expect(uuid()).not.toBe(uuid());
  expect(uuid()).not.toBe(uuid());
});

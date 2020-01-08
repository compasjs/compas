import "jest";
import { getSecondsSinceEpoch } from "./utils";

test("getSecondsSinceEpoch returns integer", () => {
  expect(Number.isInteger(getSecondsSinceEpoch())).toBeTruthy();
});

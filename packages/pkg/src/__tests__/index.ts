import "jest";
import { foo } from "../index";

test("foo", () => {
  expect(foo).toBe(6);
});

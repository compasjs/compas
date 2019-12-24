import "jest";
import { bytesToHumanReadable } from "./utils";

test("correctly format bytes to more human friendly format", () => {
  expect(bytesToHumanReadable(0)).toBe("0 Byte");
  expect(bytesToHumanReadable(11)).toBe("11 Bytes");
  expect(bytesToHumanReadable(1024)).toBe("1 KiB");
  expect(bytesToHumanReadable(1111)).toBe("1.08 KiB");
  expect(bytesToHumanReadable(1130)).toBe("1.1 KiB");
});

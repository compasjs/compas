import "jest";
import {
  bytesToHumanReadable, Logger, printProcessMemoryUsage, resetWriter,
} from "./logger";

test("correctly format bytes to more human friendly format", () => {
  expect(bytesToHumanReadable(0))
  .toBe("0 Byte");
  expect(bytesToHumanReadable(11))
  .toBe("11 Bytes");
  expect(bytesToHumanReadable(1024))
  .toBe("1 KiB");
  expect(bytesToHumanReadable(1111))
  .toBe("1.08 KiB");
  expect(bytesToHumanReadable(1130))
  .toBe("1.1 KiB");
});

test("printProcessMemoryUsage", () => {
  const mock = jest.fn();
  const logger = ({ info: mock } as unknown) as Logger;
  printProcessMemoryUsage(logger);
  expect(mock)
  .toHaveBeenCalledTimes(1);
  expect(mock.mock.calls[0][0])
  .toMatchObject({
    rss: expect.any(String),
    heapUsed: expect.any(String),
    heapTotal: expect.any(String),
    external: expect.any(String),
  });
});

test("resetWriter default pretty print", () => {
  const mockWrite = jest.fn();
  resetWriter(({ write: mockWrite } as any) as NodeJS.WriteStream);

  new Logger(2, {}).info("test");
  expect(mockWrite.mock.calls.length).toBeGreaterThan(1);
});

test("resetWriter use NODE_ENV=production", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";

  const mockWrite = jest.fn();
  resetWriter(({ write: mockWrite } as any) as NodeJS.WriteStream);

  new Logger(2, {}).info("test");
  expect(mockWrite.mock.calls.length).toBe(1);
  expect(mockWrite.mock.calls[0].length).toBe(1);

  process.env.NODE_ENV = originalNodeEnv;
});

test("resetWriter use NODE_ENV=development", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";

  const mockWrite = jest.fn();
  resetWriter(({ write: mockWrite } as any) as NodeJS.WriteStream);

  new Logger(2, {}).info("test");
  expect(mockWrite.mock.calls.length).toBeGreaterThan(1);

  process.env.NODE_ENV = originalNodeEnv;
});

import "jest";
import { Logger, printProcessMemoryUsage } from "../logger";

test("printProcessMemoryUsage", () => {
  const mock = jest.fn();
  const logger = ({ info: mock } as unknown) as Logger;
  printProcessMemoryUsage(logger);
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock.mock.calls[0][0]).toMatchObject({
    rss: expect.any(String),
    heapUsed: expect.any(String),
    heapTotal: expect.any(String),
    external: expect.any(String),
  });
});

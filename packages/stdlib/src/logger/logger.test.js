import { mainTestFn, test } from "@compas/cli";
import pino from "pino";
import { newLogger, setGlobalLoggerOptions } from "./logger.js";

mainTestFn(import.meta);

test("stdlib/logger", (t) => {
  const getLogInstanceWithMockedWrite = () => {
    const logLines = [];

    setGlobalLoggerOptions({
      pinoDestination: {
        write(line) {
          logLines.push(JSON.parse(line));
        },
      },
    });

    const logger = newLogger({
      printer: "ndjson",
    });

    return { logger, logLines };
  };

  t.test("level", (t) => {
    const { logger, logLines } = getLogInstanceWithMockedWrite();

    logger.info("hi");
    logger.error("hi");

    t.equal(logLines.length, 2);
    t.equal(logLines[0].level, "info");
    t.equal(logLines[1].level, "error");
  });

  t.test("time", (t) => {
    const { logger, logLines } = getLogInstanceWithMockedWrite();
    logger.info("foo");

    t.equal(logLines.length, 1);
    t.ok(logLines[0].time);
  });

  t.test("with context", (t) => {
    const { logger, logLines } = getLogInstanceWithMockedWrite();

    logger.info({});
    logger.error({});

    t.equal(logLines.length, 2);
    t.ok(logLines[0].context);
    t.ok(logLines[1].context);
  });

  t.test("messages", (t) => {
    const { logger, logLines } = getLogInstanceWithMockedWrite();

    logger.info(true);
    logger.info(5);
    logger.info("foo");
    logger.info({ foo: "bar" });

    t.equal(logLines.length, 4);
    t.equal(logLines[0].message, true);
    t.equal(logLines[1].message, 5);
    t.equal(logLines[2].message, "foo");
    t.deepEqual(logLines[3].message, { foo: "bar" });
  });

  t.test("teardown", (t) => {
    setGlobalLoggerOptions({ pinoDestination: pino.destination(1) });
    t.pass();
  });
});

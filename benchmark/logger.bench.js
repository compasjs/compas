import { bench, mainBenchFn } from "@compas/cli";
import { newLogger, setGlobalLoggerOptions } from "@compas/stdlib";
import pino from "pino";

mainBenchFn(import.meta);

setGlobalLoggerOptions({
  pinoDestination: {
    write() {},
  },
});

bench("logger - strings", (b) => {
  const logger = newLogger({
    printer: "ndjson",
  });

  for (let i = 0; i < b.N; ++i) {
    logger.info("My simple string");
  }
});

bench("pino - default - strings", (b) => {
  const logger = pino(
    {},
    {
      write: () => {},
    },
  );

  for (let i = 0; i < b.N; ++i) {
    logger.info("My simple string");
  }
});

bench("logger - objects", (b) => {
  const logger = newLogger({
    printer: "ndjson",
  });

  for (let i = 0; i < b.N; ++i) {
    logger.info({
      my: {
        simple: "object",
      },
    });
  }
});

bench("pino - default - objects", (b) => {
  const logger = pino(
    {},
    {
      write: () => {},
    },
  );

  for (let i = 0; i < b.N; ++i) {
    logger.info({
      my: {
        simple: "object",
      },
    });
  }
});

bench("logger - deep objects", (b) => {
  const logger = newLogger({
    printer: "ndjson",
  });

  for (let i = 0; i < b.N; ++i) {
    logger.info({
      my: {
        more: [
          {
            advanced: {
              object: "with",
              multiple: "keys",
              foo: 5,
            },
          },
        ],
      },
      bar: true,
    });
  }
});

bench("pino - default - deep objects", (b) => {
  const logger = pino(
    {},
    {
      write: () => {},
    },
  );

  for (let i = 0; i < b.N; ++i) {
    logger.info({
      my: {
        more: [
          {
            advanced: {
              object: "with",
              multiple: "keys",
              foo: 5,
            },
          },
        ],
      },
      bar: true,
    });
  }
});

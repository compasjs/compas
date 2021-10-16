import { bench, mainBenchFn } from "@compas/cli";
import pino from "pino";
import { newLogger } from "./logger.js";

mainBenchFn(import.meta);

const getCompasCompatiblePino = () => {
  const pinoLogger = pino(
    {
      formatters: {
        level: (label) => ({ level: label }),
        bindings: () => ({}),
      },
      serializers: {},
      base: {},
      // We don't add time here, since it's much faster without
      // timestamp: () => `, "timestamp": "${new Date().toISOString()}"`,
    },
    {
      write() {},
    },
  ).child({ context: { application: "compas" } });

  return {
    info: (message) => pinoLogger.info({ message }),
    error: (message) => pinoLogger.error({ message }),
  };
};

bench("logger - strings", (b) => {
  const logger = newLogger({
    printer: "ndjson",
    stream: {
      write: () => {},
    },
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
bench("pino - compas compat - strings", (b) => {
  const logger = getCompasCompatiblePino();

  for (let i = 0; i < b.N; ++i) {
    logger.info("My simple string");
  }
});

bench("logger - objects", (b) => {
  const logger = newLogger({
    printer: "ndjson",
    stream: {
      write: () => {},
    },
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

bench("pino - compas compat - objects", (b) => {
  const logger = getCompasCompatiblePino();

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
    stream: {
      write: () => {},
    },
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

bench("pino - compas compat - deep objects", (b) => {
  const logger = getCompasCompatiblePino();

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

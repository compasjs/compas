import { createWriteStream } from "fs";
import { bench, mainBenchFn } from "@lbu/cli";
import { newLogger } from "./logger.js";

mainBenchFn(import.meta);

bench("logger - strings", (b) => {
  const stream = createWriteStream("/tmp/logger_bench_lbu.txt", "utf-8");
  const logger = newLogger({
    pretty: false,
    stream,
  });

  for (let i = 0; i < b.N; ++i) {
    logger.info("My simple string");
  }

  stream.end();
});

bench("logger - objects", (b) => {
  const stream = createWriteStream("/tmp/logger_bench_lbu.txt", "utf-8");
  const logger = newLogger({
    pretty: false,
    stream,
  });

  for (let i = 0; i < b.N; ++i) {
    logger.info({
      my: {
        simple: "object",
      },
    });
  }

  stream.end();
});

bench("logger - deep objects", (b) => {
  const stream = createWriteStream("/tmp/logger_bench_lbu.txt", "utf-8");
  const logger = newLogger({
    pretty: false,
    stream,
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

  stream.end();
});

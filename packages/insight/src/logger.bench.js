import { createWriteStream } from "fs";
import { log } from "@lbu/insight";
import { bench, logBenchResults, mainFn } from "@lbu/stdlib";
import { newLogger } from "./logger.js";

mainFn(import.meta, log, async (logger) => {
  await runBench();
  logBenchResults(logger);
});

export async function runBench() {
  await bench("logger - strings", (N) => {
    const stream = createWriteStream("/tmp/logger_bench_lbu.txt", "utf-8");
    const logger = newLogger({
      pretty: false,
      stream,
    });

    for (let i = 0; i < N; ++i) {
      logger.info("My simple string");
    }

    stream.end();
  });

  await bench("logger - objects", (N) => {
    const stream = createWriteStream("/tmp/logger_bench_lbu.txt", "utf-8");
    const logger = newLogger({
      pretty: false,
      stream,
    });

    for (let i = 0; i < N; ++i) {
      logger.info({
        my: {
          simple: "object",
        },
      });
    }

    stream.end();
  });

  await bench("logger - deep objects", (N) => {
    const stream = createWriteStream("/tmp/logger_bench_lbu.txt", "utf-8");
    const logger = newLogger({
      pretty: false,
      stream,
    });

    for (let i = 0; i < N; ++i) {
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
}

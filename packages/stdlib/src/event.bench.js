import { bench, mainBenchFn } from "../../cli/index.js";
import {
  eventStart,
  eventStop,
  newEvent,
  newEventFromEvent,
} from "./events.js";
import { newLogger } from "./logger/logger.js";

mainBenchFn(import.meta);

bench("event - start", (b) => {
  const logger = newLogger({
    disableInfoLogger: true,
    disableErrorLogger: true,
  });

  for (let i = 0; i < b.N; ++i) {
    const e = newEvent(logger);
    eventStart(e, "foo");
  }
});

bench("event - start/stop", (b) => {
  const logger = newLogger({
    disableInfoLogger: true,
    disableErrorLogger: true,
  });

  for (let i = 0; i < b.N; ++i) {
    const e = newEvent(logger);
    eventStart(e, "foo");
    eventStop(e);
  }
});

bench("event - eventFromEvent", (b) => {
  const logger = newLogger({
    disableInfoLogger: true,
    disableErrorLogger: true,
  });

  for (let i = 0; i < b.N; ++i) {
    const e = newEvent(logger);
    eventStart(e, "foo");

    const subE = newEventFromEvent(e);
    eventStart(subE, "bar");
    eventStop(subE);

    eventStop(e);
  }
});

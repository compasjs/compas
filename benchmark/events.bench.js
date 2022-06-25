import { bench, mainBenchFn } from "@compas/cli";
import {
  eventStart,
  eventStop,
  newEvent,
  newEventFromEvent,
  newLogger,
} from "@compas/stdlib";

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

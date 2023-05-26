import { bench, mainBenchFn } from "@compas/cli";
import {
  eventStart,
  eventStop,
  newEvent,
  newEventFromEvent,
} from "@compas/stdlib";

const newLogger = () => ({ info: () => {}, error: () => {} });

mainBenchFn(import.meta);

bench("event - start", (b) => {
  const logger = newLogger();

  for (let i = 0; i < b.N; ++i) {
    const e = newEvent(logger);
    eventStart(e, "foo");
  }
});

bench("event - start/stop", (b) => {
  const logger = newLogger();

  for (let i = 0; i < b.N; ++i) {
    const e = newEvent(logger);
    eventStart(e, "foo");
    eventStop(e);
  }
});

for (const { loopX, loopY, loopZ } of [
  { loopX: 2, loopY: 10, loopZ: 0 },
  { loopX: 10, loopY: 2, loopZ: 0 },
  { loopX: 10, loopY: 10, loopZ: 0 },
  { loopX: 2, loopY: 10, loopZ: 2 },
  { loopX: 10, loopY: 2, loopZ: 2 },
  { loopX: 10, loopY: 10, loopZ: 2 },
]) {
  bench(`event - nested (x: ${loopX}, y: ${loopY}, z: ${loopZ})`, (b) => {
    const logger = newLogger();

    for (let i = 0; i < b.N; ++i) {
      const e = newEvent(logger);
      eventStart(e, "foo");

      for (let x = 0; x < loopX; ++x) {
        const subEventX = newEventFromEvent(e);
        eventStart(subEventX, "bar");

        for (let y = 0; y < loopY; ++y) {
          const subEventY = newEventFromEvent(subEventX);
          eventStart(subEventY, "bar");

          for (let z = 0; z < loopZ; ++z) {
            const subEventZ = newEventFromEvent(subEventY);
            eventStart(subEventZ, "bar");
            eventStop(subEventZ);
          }

          eventStop(subEventY);
        }

        eventStop(subEventX);
      }

      eventStop(e);
    }
  });
}

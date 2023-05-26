import { mainTestFn, test } from "@compas/cli";
import { isNil, newLogger } from "../index.js";
import {
  eventRename,
  eventStart,
  eventStop,
  newEvent,
  newEventFromEvent,
} from "./events.js";

mainTestFn(import.meta);

test("stdlib/events", (t) => {
  const log = newLogger();

  t.test("create root event", (t) => {
    const event = newEvent(log);

    t.ok(isNil(event.rootEvent));
    t.ok(isNil(event.name));
    t.ok(isNil(event.span.name));
    t.equal(event.log, log);
    t.equal(event.span.children.length, 0);
  });

  t.test("create event from event", (t) => {
    const event = newEvent(log);
    const child = newEventFromEvent(event);

    t.ok(child.rootEvent);
    t.equal(child.span.children.length, 0);
    t.equal(child.span, event.span.children[0]);
  });

  t.test("event start adds name", (t) => {
    const event = newEvent(t.log);

    eventStart(event, "test");

    t.equal(event.name, "test");
    t.equal(event.span.name, "test");
    t.ok(event.span.startTime);
  });

  t.test("event stop calculates duration", (t) => {
    const event = newEvent(t.log);

    eventStart(event, "foo");
    eventStop(event);

    t.ok(event.span.startTime);
    t.ok(event.span.stopTime);
    t.equal(event.span.duration, 0);
  });

  t.test("event abort ", (t) => {
    const abortController = new AbortController();

    const event = newEvent(t.log, abortController.signal);
    eventStart(event, "foo");

    abortController.abort();

    try {
      newEventFromEvent(event);
    } catch (e) {
      t.equal(e.key, "error.server.internal");
      t.equal(e.status, 500);

      t.ok(event.span.abortedTime);
      t.ok(isNil(event.span.duration));
      t.equal(e.info.span.name, event.name);
    }
  });

  t.test("rename an event", (t) => {
    const event = newEvent(t.log);
    eventStart(event, "foo");

    t.equal(event.name, "foo");
    t.equal(event.span.name, "foo");

    eventRename(event, "bar");

    t.equal(event.name, "bar");
    t.equal(event.span.name, "bar");
  });
});

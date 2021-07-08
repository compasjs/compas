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
    t.ok(isNil(event.root));
    t.equal(event.callStack.length, 0);
  });

  t.test("create event from event", (t) => {
    const event = newEvent(log);
    const child = newEventFromEvent(event);

    t.ok(child.root);
    t.equal(child.callStack.length, 0);
    t.equal(event.callStack.length, 1);
    t.equal(event.callStack[0], child.callStack);
  });

  t.test("event start adds name", (t) => {
    const event = newEvent(t.log);
    eventStart(event, "test");
    t.equal(event.name, "test");
  });

  t.test("event start adds callStack item", (t) => {
    const event = newEvent(t.log);
    t.equal(event.callStack.length, 0);
    eventStart(event, "test");
    t.equal(event.callStack.length, 1);
    t.equal(event.callStack[0].type, "start");
  });

  t.test("event stop adds callStack item", (t) => {
    const event = newEvent(t.log);
    t.equal(event.callStack.length, 0);
    eventStop(event);
    t.equal(event.callStack.length, 1);
    t.equal(event.callStack[0].type, "stop");
  });

  t.test("event stop adds duration", (t) => {
    const event = newEvent(t.log);
    eventStart(event, "foo");
    eventStop(event);
    t.ok(!isNil(event.callStack[0].duration));
  });

  t.test("event abort adds duration", (t) => {
    const abortController = new AbortController();

    const event = newEvent(t.log, abortController.signal);
    eventStart(event, "foo");

    abortController.abort();

    try {
      newEventFromEvent(event);
    } catch (e) {
      t.equal(e.key, "error.server.internal");
      t.equal(e.status, 500);
      // reference equality of `getRootEvent`
      t.equal(e.info.event.type, "event_callstack");
      t.equal(e.info.event.aborted, true);
      t.equal(e.info.event.callStack.length, 2);
      t.equal(e.info.event.callStack[1].type, "aborted");
      t.ok(!isNil(event.callStack[0].duration));
    }
  });

  t.test("rename an event", (t) => {
    const event = newEvent(t.log);
    eventStart(event, "foo");
    t.equal(event.name, "foo");
    t.equal(event.callStack[0].name, "foo");
    eventRename(event, "bar");

    t.equal(event.name, "bar");
    t.equal(event.callStack[0].name, "bar");
  });
});

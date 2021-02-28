import { mainTestFn, test } from "@compas/cli";
import { newLogger } from "../index.js";
import {
  eventRename,
  eventStart,
  eventStop,
  newEvent,
  newEventFromEvent,
} from "./events.js";

mainTestFn(import.meta);

test("insight/events", (t) => {
  const log = newLogger();

  t.test("create root event", (t) => {
    const event = newEvent(log);
    t.equal(event.root, true);
    t.equal(event.callStack.length, 0);
  });

  t.test("create event from event", (t) => {
    const event = newEvent(log);
    const child = newEventFromEvent(event);

    t.equal(child.root, false);
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

import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { eventStart, eventStop, isNil } from "@compas/stdlib";

mainTestFn(import.meta);

test("cli/testing/events", (t) => {
  t.test("newTestEvent - start", (t) => {
    const event = newTestEvent(t);
    eventStart(event, "test");

    t.equal(event.name, "test");
  });

  t.test("newTestEvent - stop", (t) => {
    const event = newTestEvent(t);
    eventStart(event, "test");
    eventStop(event);

    t.ok(!isNil(event.span?.duration));
    t.equal(event.span.children?.length, 0);
  });
});

import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { sql } from "../../../src/testing.js";
import { jobSessionStoreCleanup } from "./session-store-jobs.js";

mainTestFn(import.meta);

test("store/session-store-jobs", (t) => {
  t.test("jobSessionStoreCleanup", async (t) => {
    const job = jobSessionStoreCleanup();

    await job(newTestEvent(t), sql, {});

    t.pass();
  });
});

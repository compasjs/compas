import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { sql } from "../../../src/testing.js";
import {
  jobSessionStoreCleanup,
  jobSessionStoreProcessLeakedSession,
} from "./session-store-jobs.js";

mainTestFn(import.meta);

test("store/session-store-jobs", (t) => {
  t.test("jobSessionStoreCleanup", async (t) => {
    const job = jobSessionStoreCleanup();

    await job(newTestEvent(t), sql, {});

    t.pass();
  });

  t.test("jobSessionStoreProcessLeakedSession", async (t) => {
    const job = jobSessionStoreProcessLeakedSession();

    await job(newTestEvent(t), sql, {
      data: {
        report: {
          session: {
            createdAt: new Date(),
            revokedAt: new Date(),
            tokens: [
              {
                createdAt: new Date(),
                revokedAt: new Date(),
              },
            ],
          },
        },
      },
    });

    t.pass();
  });
});

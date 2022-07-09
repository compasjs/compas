import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { minioClient, testBucketName, sql } from "../../../src/testing.js";
import { jobFileCleanup } from "./files-jobs.js";

mainTestFn(import.meta);

test("store/files-jobs", (t) => {
  t.test("jobFileCleanup", async (t) => {
    const job = jobFileCleanup(minioClient, testBucketName);

    await job(newTestEvent(t), sql, {});

    t.pass();
  });
});

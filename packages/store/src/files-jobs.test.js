import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { dirnameForModule, pathJoin } from "@compas/stdlib";
import { minioClient, testBucketName, sql } from "../../../src/testing.js";
import {
  jobFileCleanup,
  jobFileGeneratePlaceholderImage,
} from "./files-jobs.js";
import { createOrUpdateFile } from "./files.js";
import { queryFile } from "./generated/database/file.js";
import { queryJob } from "./generated/database/job.js";

mainTestFn(import.meta);

test("store/files-jobs", (t) => {
  t.test("jobFileCleanup", async (t) => {
    const job = jobFileCleanup(minioClient, testBucketName);

    await job(newTestEvent(t), sql, {});

    t.pass();
  });

  t.test("jobFileGeneratePlaceholderImage", async (t) => {
    const fileInputPath = pathJoin(
      dirnameForModule(import.meta),
      `../__fixtures__/50.png`,
    );

    const file = await createOrUpdateFile(
      sql,
      minioClient,
      testBucketName,
      {
        name: "test.png",
      },
      fileInputPath,
      {
        allowedContentTypes: ["image/png"],
        schedulePlaceholderImageJob: true,
      },
    );

    const [job] = await queryJob({
      where: {
        isComplete: false,
        name: "compas.file.generatePlaceholderImage",
      },
      orderBy: ["createdAt"],
      orderBySpec: {
        createdAt: "DESC",
      },
      limit: 1,
    }).exec(sql);

    t.ok(job);
    t.equal(job.data.fileId, file.id);

    await jobFileGeneratePlaceholderImage(minioClient, testBucketName)(
      newTestEvent(t),
      sql,
      job,
    );

    const [reloadedFile] = await queryFile({
      where: {
        id: file.id,
      },
    }).exec(sql);

    t.ok(reloadedFile.meta.placeholderImage);
    t.ok(
      reloadedFile.meta.placeholderImage.startsWith("data:image/jpeg;base64,"),
    );

    // This increases response sizes, so not sure what we should do about that.
    // It's currently a 400(ish) character long string.
    t.ok(reloadedFile.meta.placeholderImage.length < 500);
  });
});

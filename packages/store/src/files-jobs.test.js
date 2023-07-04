import { mainTestFn, newTestEvent, test } from "@compas/cli";
import { dirnameForModule, pathJoin } from "@compas/stdlib";
import { s3Client, sql, testBucketName } from "../../../src/testing.js";
import { fileCreateOrUpdate } from "./file.js";
import {
  jobFileCleanup,
  jobFileGeneratePlaceholderImage,
} from "./files-jobs.js";
import { queryFile } from "./generated/database/file.js";
import { queryJob } from "./generated/database/job.js";

mainTestFn(import.meta);

test("store/files-jobs", (t) => {
  t.test("jobFileCleanup", async (t) => {
    const job = jobFileCleanup(s3Client, testBucketName);

    await job(newTestEvent(t), sql, {});

    t.pass();
  });

  t.test("jobFileGeneratePlaceholderImage", async (t) => {
    const fileInputPath = pathJoin(
      dirnameForModule(import.meta),
      `../__fixtures__/50.png`,
    );

    const file = await fileCreateOrUpdate(
      sql,
      s3Client,
      {
        bucketName: testBucketName,
        allowedContentTypes: ["image/png"],
        schedulePlaceholderImageJob: true,
      },
      {
        name: "test.png",
      },
      fileInputPath,
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

    await jobFileGeneratePlaceholderImage(s3Client, testBucketName)(
      newTestEvent(t),
      sql,
      job,
    );

    const [reloadedFile] = await queryFile({
      where: {
        id: file.id,
      },
    }).exec(sql);

    t.ok(reloadedFile.meta.originalWidth);
    t.ok(reloadedFile.meta.originalHeight);
    t.ok(reloadedFile.meta.placeholderImage);
    t.ok(
      reloadedFile.meta.placeholderImage.startsWith("data:image/jpeg;base64,"),
    );

    // This increases response sizes, so not sure what we should do about that.
    // It's currently a 400(ish) character long string.
    t.ok(reloadedFile.meta.placeholderImage.length < 500);
  });
});
